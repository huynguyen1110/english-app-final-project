<script setup>
import { format } from 'date-fns';
import { deleteGrammarService, getGrammarsService } from '@/service/content/ContentService';
import { onMounted, ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { USER_ROLE, USER_STATUSES } from '@/Constaints/Constaints';

const toast = useToast();
const router = useRouter();

const grammarsData = ref([]);
const selectedGrammars = ref();
const deleteGrammarDialog = ref(false);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

function getStatusLabel(status) {
    switch (status) {
        case true:
            return 'success';
        case false:
            return 'danger';
        default:
            return 'unknown'; // Trả về một giá trị mặc định nếu không khớp
    }
}


onMounted(() => {
    localStorage.removeItem('grammarToEdit');
    fetchGetGrammarApi();
});

async function fetchGetGrammarApi() {
    try {
        const params = {
            page: 1,
            size: 1000,
            sortField: 'title',
            sortDirection: true
        };
        const { data } = await getGrammarsService(params);
        grammarsData.value = data?.content;
    } catch (e) {
        console.error(e);
    }
}

async function deleteSelectedGrammar() {
    try {
        const deleteGrammarResponse = await Promise.all(
            selectedGrammars?.value?.map(async (item) => {
                const { grammarId } = item;
                const { data } = await deleteGrammarService(grammarId);
                return data; // trả về dữ liệu của từng yêu cầu xóa (nếu cần)
            })
        );

        if (deleteGrammarResponse.length > 0) {
            toast.add({ severity: 'success', summary: 'Deleted successfully', life: 3000 });
            fetchGetGrammarApi();
            deleteGrammarDialog.value = false;
        } else {
            toast.add({ severity: 'error', summary: 'Failed to delete', life: 3000 });
        }
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Failed to delete', life: 3000 });
        console.error('Error deleting selected grammars:', e);
    }
}

function navigateToCreatePage() {
    router.push({ name: 'create-grammar' });
}

function navigateToEditPage(grammarId) {
    const grammarToEdit = grammarsData.value?.find((grammar) => grammar?.grammarId === grammarId);

    if (!grammarToEdit) {
        console.warn('Grammar not found!');
        return;
    }

    // Chuyển đối tượng grammarToEdit thành chuỗi JSON trước khi lưu vào localStorage
    localStorage.setItem('grammarToEdit', JSON.stringify(grammarToEdit));

    // Điều hướng đến trang chỉnh sửa
    router.push({ name: 'edit-grammar' });
}


</script>

<template>
    <div class="card">
        <Toolbar class="mb-6">
            <template #start>
                <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="deleteGrammarDialog = true"
                        :disabled="!selectedGrammars || !selectedGrammars.length" />
            </template>
            <template #end>
                <Button label="Create new" icon="pi pi-plus" severity="secondary" @click="navigateToCreatePage" />
            </template>
        </Toolbar>

        <div class="font-semibold text-xl mb-4">Filtering</div>

        <DataTable
            ref="dt"
            v-model:selection="selectedGrammars"
            :value="grammarsData"
            dataKey="grammarId"
            :paginator="true"
            :rows="10"
            :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} grammar content"
        >
            <template #header>
                <div class="flex flex-wrap gap-2 items-center justify-between">
                    <h4 class="m-0">Grammar content</h4>
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
                <div class="column-wrapper">
                    <Column field="title" header="Title" sortable style="min-width: 10rem">
                        <template #body="slotProps">
                            <span @click="navigateToEditPage(slotProps.data?.grammarId)"
                                  class="tooltip">{{ slotProps.data.title }}
                                <span class="tooltip-text">Click here to edit</span>
                            </span>
                        </template>
                    </Column>

                </div>
                <Column field="description" header="Description" sortable style="min-width: 16rem"></Column>
                <Column field="createBy" header="Create by" sortable style="min-width: 16rem"></Column>
                <Column field="updateBy" header="Update by" sortable style="min-width: 16rem"></Column>
                <Column field="createdDate" header="Created date" sortable style="min-width: 10rem">
                    <template #body="slotProps">
                        {{ slotProps?.data?.createdDate ? format(slotProps.data.createdDate, 'dd-MM-yyyy HH:mm:ss') : ''
                        }}
                    </template>
                </Column>
                <Column field="updatedDate" header="Updated date" sortable style="min-width: 10rem">
                    <template #body="slotProps">
                        {{ slotProps?.data?.updatedDate ? format(slotProps.data.updatedDate, 'dd-MM-yyyy HH:mm:ss') : ''
                        }}
                    </template>
                </Column>
                <Column field="isPublished" header="Is published" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Tag :value="slotProps?.data?.isPublished"
                             :severity="getStatusLabel(slotProps?.data?.isPublished)" class="mb-4" />
                    </template>
                </Column>
            </div>
        </DataTable>

        <Dialog v-model:visible="deleteGrammarDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="selectedGrammars">Are you sure you want to delete the selected Grammars?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteGrammarDialog = false" />
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
