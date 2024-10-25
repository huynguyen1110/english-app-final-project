<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { CATEGORY, NEWS_DOMAIN_NAME, SOURCE_NEWS_NAME } from '@/utils/Constaints';
import { useToast } from 'primevue/usetoast';
import {
    deleteNewsService,
    getNewsBySourceNameFromDbService,
    getNewsFromDbService
} from '@/service/news/NewsService';
import { format } from 'date-fns';

const display = ref(false);
const newsFromDbData = ref([]);
const selectedNews = ref();
const deleteNewsDialog = ref(false);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const toast = useToast();

const dropdownSourceNewsValue = ref(null);
const dropdownSourceNewsValues = ref([
    { name: SOURCE_NEWS_NAME.BBC_NEWS },
    { name: SOURCE_NEWS_NAME.FOX_NEWS },
    { name: SOURCE_NEWS_NAME.CNN_COM },
    { name: SOURCE_NEWS_NAME.GLOBAL_NEWS },
    { name: SOURCE_NEWS_NAME.TECH_CRUNCH }
]);

onMounted(() => {
    if (localStorage.getItem('newsFromDb')) {
        localStorage.removeItem('news');
        newsFromDbData.value = JSON.parse(localStorage.getItem('newsFromDb'));
    }
});

function open() {
    display.value = true;
}

function confirmDeleteSelected() {
    deleteNewsDialog.value = true;
}

async function getALlBtn() {
    const getNewsParams = {
        page: 1,
        size: 1000,
        sortField: 'createdAt',
        sortDirection: false,
        topicId: null
    };
    try {
        const response = await getNewsFromDbService(getNewsParams);
        const { data } = response;
        newsFromDbData.value = data?.content;
        const newsDataWithId = newsFromDbData?.value?.map((article, index) => ({
            ...article, // Sao chép tất cả các thuộc tính của article
            id: index + 1 // Thêm trường id tự tăng, bắt đầu từ 1
        }));
        newsFromDbData.value = newsDataWithId;
        localStorage.removeItem('newsFromDb');
        localStorage.setItem('newsFromDb', JSON.stringify(newsDataWithId));
        localStorage.removeItem('news');
        if (!data) {
            toast.add({ severity: 'error', summary: 'Cat not get news', life: 3000 });
        }
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Cat not get news', life: 3000 });
        console.log(e);
    }
}

async function getNews() {
    if (!dropdownSourceNewsValue.value) {
        toast.add({ severity: 'info', summary: 'Please select news source', life: 3000 });
        return;
    }
    const getNewsParams = {
        page: 1,
        size: 1000,
        sortField: 'createdAt',
        sortDirection: false,
        sourceName: dropdownSourceNewsValue?.value?.name
    };
    try {
        const response = await getNewsBySourceNameFromDbService(getNewsParams);
        const { data } = response;
        newsFromDbData.value = data?.content;
        const newsDataWithId = newsFromDbData.value?.map((article, index) => ({
            ...article, // Sao chép tất cả các thuộc tính của article
            id: index + 1 // Thêm trường id tự tăng, bắt đầu từ 1
        }));
        newsFromDbData.value = newsDataWithId;
        localStorage.removeItem('newsFromDb');
        localStorage.setItem('newsFromDb', JSON.stringify(newsDataWithId));
        localStorage.removeItem('news');

        if (!data) {
            toast.add({ severity: 'error', summary: 'Cat not get news', life: 3000 });
        }
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Cat not get news', life: 3000 });
        console.log(e);
    }
    display.value = false; // Assuming this controls some loading or display state
}

async function deleteSelectedNews() {
    try {
        for (const news of selectedNews.value) {
            const response = await deleteNewsService(news?.newsId);
            const { data } = response;
            if (data) {
                // Re-assign filtered array to newsFromDbData.value to update it
                newsFromDbData.value = newsFromDbData.value.filter(
                    newsItem => newsItem?.newsId !== news?.newsId
                );
            }
        }
        deleteNewsDialog.value = false;
        localStorage.removeItem('newsFromDb');
        localStorage.setItem('newsFromDb', newsFromDbData);
    } catch (e) {
        console.error(e);
    }
}

</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Get news from system</div>
        <Dialog header="Get news params" v-model:visible="display" :breakpoints="{ '960px': '75vw' }"
                :style="{ width: '30vw' }"
                :modal="true">
            <div class="card">
                <div
                    :style="{flexDirection: 'column', width: '100%', display: 'flex'}">
                    <p :style="{fontSize: '20px'}">Select source news:</p>
                    <div :style="{width: '12px'}"></div>
                    <Select v-model="dropdownSourceNewsValue" :options="dropdownSourceNewsValues" optionLabel="name"
                            placeholder="Select" />
                </div>
            </div>
            <template #footer>
                <Button label="Get" @click="getNews" />
            </template>
        </Dialog>
        <Button :style="{marginRight: '12px'}" label="Get by source name" style="width: auto" @click="open" />
        <Button label="Get all" style="width: auto" @click="getALlBtn" />
    </div>
    <div class="card">
        <Toolbar class="mb-6">
            <template #start>
                <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected"
                        :disabled="!selectedNews || !selectedNews.length" />
            </template>
        </Toolbar>

        <div class="font-semibold text-xl mb-4">Filtering</div>
        <DataTable
            ref="dt"
            v-model:selection="selectedNews"
            :value="newsFromDbData"
            dataKey="id"
            :paginator="true"
            :rows="10"
            :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} news"
        >
            <template #header>
                <div class="flex flex-wrap gap-2 items-center justify-between">
                    <h4 class="m-0">News data</h4>
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
                <Column field="imageUrl" header="Image" sortable style="min-width: 12rem">
                    <template #body="slotProps">
                        <img :src="slotProps?.data?.imageUrl" alt="Imported Image" />
                    </template>
                </Column>
                <Column field="sourceName" header="Source" sortable style="min-width: 10rem">
                    <template #body="slotProps">
                        {{ slotProps?.data?.sourceName }}
                    </template>
                </Column>
                <Column field="title" header="Title" sortable style="min-width: 16rem">
                    <template #body="slotProps">
                        <span @click="goToNewsDetail(slotProps?.data?.id)"
                              style="cursor: pointer;"
                        > <!-- Gọi phương thức khi nhấn -->
                            {{ slotProps?.data?.title }}
                        </span>
                    </template>
                </Column>

                <Column field="description" header="Description" sortable style="min-width: 10rem"></Column>
                <Column field="author" header="Author" sortable style="min-width: 10rem"></Column>
                <Column field="publishedAt" header="Published date" sortable style="min-width: 10rem">
                    <template #body="slotProps">
                        {{ format(slotProps?.data?.publishedAt, 'dd-MM-yyyy HH:mm:ss') }}
                    </template>
                </Column>
            </div>
        </DataTable>

        <Dialog v-model:visible="deleteNewsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="selectedNews">Are you sure you want to delete the selected news?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteNewsDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedNews" />
            </template>
        </Dialog>
        <Toast />
    </div>
</template>

<style scoped lang="scss">

</style>
