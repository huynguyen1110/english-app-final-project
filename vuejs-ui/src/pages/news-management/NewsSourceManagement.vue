<script setup>
import { ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { NEWS_DOMAIN_NAME, SOURCE_NEWS_NAME } from '@/utils/Constaints';

const display = ref(false);
const keyWord = ref('');
const customers1 = ref(null);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const dropdownValue = ref(null);

const dropdownValues = ref([
    { name: SOURCE_NEWS_NAME.BBC_NEWS, domain: NEWS_DOMAIN_NAME.BBC_NEWS },
    { name: SOURCE_NEWS_NAME.FOX_NEWS, domain: NEWS_DOMAIN_NAME.FOX_NEWS },
    { name: SOURCE_NEWS_NAME.CNN_COM, domain: NEWS_DOMAIN_NAME.CNN_COM },
    { name: SOURCE_NEWS_NAME.GLOBAL_NEWS, domain: NEWS_DOMAIN_NAME.GLOBAL_NEWS },
    { name: SOURCE_NEWS_NAME.TECH_CRUNCH, domain: NEWS_DOMAIN_NAME.TECH_CRUNCH }
]);


function open() {
    display.value = true;
}

function save() {
    display.value = false;
}

</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Get news</div>
        <Dialog header="Get news params" v-model:visible="display" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }"
                :modal="true">
            <div class="card">
                <div
                    :style="{flexDirection: 'column', width: '100%', display: 'flex'}">
                    <p :style="{fontSize: '20px'}">Select news domain:</p>
                    <div :style="{width: '12px'}"></div>
                    <Select v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="Select" />
                </div>
                <div :style="{height: '12px'}"></div>
                <div
                    :style="{flexDirection: 'column', width: '100%', display: 'flex'}">
                    <p :style="{fontSize: '20px'}">Key word:</p>
                    <div :style="{width: '12px'}"></div>
                    <InputText id="keyWord" type="text" v-model="keyWord" />
                </div>
            </div>
            <template #footer>
                <Button label="Save" @click="save" />
            </template>
        </Dialog>
        <Button label="Get" style="width: auto" @click="open" />
    </div>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Filtering</div>
        <DataTable
            ref="dt"
            :value="customers1"
            dataKey="userId"
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

            <Column style="width: 3rem" :exportable="false"></Column>
            <Column field="userId" header="User Id" sortable style="min-width: 12rem"></Column>
            <Column field="username" header="User name" sortable style="min-width: 16rem"></Column>
            <Column field="email" header="Email" sortable style="min-width: 10rem"></Column>
            <Column field="phoneNumber" header="Phone number" sortable style="min-width: 10rem"></Column>
            <Column field="address" header="Address" sortable style="min-width: 10rem"></Column>
            <Column field="createdDate" header="Create date" sortable style="min-width: 10rem">
                <template #body="slotProps">
                    {{ formatDate(slotProps?.data?.createdDate) }}
                </template>
            </Column>
            <Column field="userStatus" header="Status" style="min-width: 12rem">
                <template #body="slotProps">
                    <Tag :value="slotProps?.data?.userStatus"
                         :severity="getStatusLabel(slotProps?.data?.userStatus)" />
                </template>
            </Column>
            <Column field="roles" header="Roles" style="min-width: 12rem">
                <template #body="slotProps">
                    <div v-for="role in slotProps?.data?.roles" :key="role">
                        <Tag :value="role"
                             :severity="getStatusLabel(role)" class="mb-4" />
                    </div>
                </template>
            </Column>
            <Column :exportable="false" style="min-width: 12rem">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2"
                            @click="editUser(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger"
                            @click="confirmDeleteUser(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </div>

</template>

<style scoped lang="scss">

</style>
