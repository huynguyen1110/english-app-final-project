<script setup>
import { format } from 'date-fns';
import {
    deleteGrammarService,
    deleteStoryService,
    getGrammarsService,
    getStoriesService
} from '@/service/content/ContentService';
import { onMounted, ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();

const storiesData = ref([]);
const selectedStories = ref();
const deleteStoryDialog = ref(false);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});


onMounted(() => {
    localStorage.removeItem("storyToEdit");
    fetchGetStoryApi();
});

async function fetchGetStoryApi() {
    try {
        const params = {
            page: 1,
            size: 1000,
            sortBy: 'vnTitle',
            direction: true
        };
        const { data } = await getStoriesService(params);
        storiesData.value = data?.content;
        console.log(storiesData);
    } catch (e) {
        console.error(e);
    }
}

async function deleteSelectedGrammar() {
    try {
        const deleteStoryResponses = await Promise.all(
            selectedStories?.value?.map(async (item) => {
                const { id } = item;
                const { data } = await deleteStoryService(id);
                return data; // trả về dữ liệu của từng yêu cầu xóa (nếu cần)
            })
        );

        if (deleteStoryResponses.length > 0) {
            toast.add({ severity: 'success', summary: 'Deleted successfully', life: 3000 });
            fetchGetStoryApi();
            deleteStoryDialog.value = false;
        } else {
            toast.add({ severity: 'error', summary: 'Failed to delete', life: 3000 });
        }
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Failed to delete', life: 3000 });
        console.error('Error deleting selected grammars:', e);
    }
}

function navigateToCreatePage() {
    router.push({ name: 'create-story' });
}

function navigateToEditPage(id) {
    const storyToEdit = storiesData.value?.find((story) => story?.id === id);

    if (!storyToEdit) {
        console.warn('Grammar not found!');
        return;
    }

    // Chuyển đối tượng grammarToEdit thành chuỗi JSON trước khi lưu vào localStorage
    localStorage.setItem('storyToEdit', JSON.stringify(storyToEdit));

    // Điều hướng đến trang chỉnh sửa
    router.push({ name: 'edit-story' });
}


</script>

<template>
    <div class="card">
        <Toolbar class="mb-6">
            <template #start>
                <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="deleteStoryDialog = true"
                        :disabled="!selectedStories || !selectedStories.length" />
            </template>
            <template #end>
                <Button label="Create new" icon="pi pi-plus" severity="secondary" @click="navigateToCreatePage" />
            </template>
        </Toolbar>

        <div class="font-semibold text-xl mb-4">Filtering</div>

        <DataTable
            ref="dt"
            v-model:selection="selectedStories"
            :value="storiesData"
            dataKey="id"
            :paginator="true"
            :rows="10"
            :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} grammar content"
        >
            <template #header>
                <div class="flex flex-wrap gap-2 items-center justify-between">
                    <h4 class="m-0">Stories content</h4>
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                    </IconField>
                </div>
            </template>

            <div>
                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="engTitle" header="Eng title" sortable style="min-width: 10rem">
                    <template #body="slotProps">
                        <div class="grid grid-cols-1 gap-4"> <!-- sử dụng grid-cols-1 để có một cột -->
                            <div class="tooltip" @click="navigateToEditPage(slotProps.data.id)">
                                {{ slotProps.data.engTitle }}
                                <span class="tooltip-text">Click here to edit</span>
                            </div>
                        </div>
                    </template>
                </Column>
                <Column field="vnTitle" header="VN title" sortable style="min-width: 12rem">
                    <template #body="slotProps">
                        <div class="grid grid-cols-1 gap-4"> <!-- sử dụng grid-cols-1 để có một cột -->
                            <div class="tooltip" @click="navigateToEditPage(slotProps.data.id)">
                                {{ slotProps.data.vnTitle }}
                                <span class="tooltip-text">Click here to edit</span>
                            </div>
                        </div>
                    </template>
                </Column>
                <Column field="createdAt" header="Created Date" sortable style="min-width: 10rem">
                    <template #body="slotProps">
                        {{ slotProps?.data?.createdAt ? format(slotProps.data.createdAt, 'dd-MM-yyyy HH:mm:ss') : '' }}
                    </template>
                </Column>
            </div>
        </DataTable>

        <Dialog v-model:visible="deleteStoryDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="selectedStories">Are you sure you want to delete the selected Stories?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteStoryDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedGrammar" />
            </template>
        </Dialog>
    </div>
    <Toast />
</template>

<style scoped lang="scss">

.bold-header {
    font-weight: bold; /* Đặt độ đậm cho chữ */
}

.column-wrapper {
    position: relative;
    display: inline-block;
}

.tooltip {
    position: relative;
    cursor: pointer;
    color: #333;
}

.tooltip .tooltip-text {
    visibility: hidden;
    width: 120px;
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 5px;
    padding: 5px;
    position: absolute;
    z-index: 1;
    bottom: 100%; /* Đặt tooltip bên trên văn bản */
    left: 50%;
    margin-left: -60px;
    opacity: 0;
    transition: opacity 0.3s;
}

.tooltip:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
}
</style>
