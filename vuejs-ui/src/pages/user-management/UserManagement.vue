<script setup>
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import {
    passwordValidator,
    validateCheckPassowrd,
    validateEmail,
    validatePhoneNumber
} from '@/service/auth/AuthService';

onMounted(() => {
    ProductService.getProducts().then((data) => (products.value = data));
});

const toast = useToast();
const dt = ref();
const products = ref();
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const user = ref({});
const selectedProducts = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);
const statuses = ref([
    { label: 'INSTOCK', value: 'instock' },
    { label: 'LOWSTOCK', value: 'lowstock' },
    { label: 'OUTOFSTOCK', value: 'outofstock' }
]);

const userStatuses = ref([
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'IS DELETE', value: 'IS_DELETE' }
]);

function formatCurrency(value) {
    if (value) return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return;
}

function openNew() {
    user.value = {};
    submitted.value = false;
    productDialog.value = true;
}

function hideDialog() {
    productDialog.value = false;
    submitted.value = false;
}

function validateInput(data) {
    let isValid = true;
    if (data?.name === '') {
        isValid = false;
    }
    if (validateEmail(data?.email) !== '') {
        isValid = false;
    }
    if (validatePhoneNumber(data?.phoneNumber) !== '') {
        isValid = false;
    }
    if (data?.address === '') {
        isValid = false;
    }
    if (passwordValidator(data?.password)) {
        isValid = false;
    }
    if (validateCheckPassowrd(data?.confirmPassword, data?.password) !== '') {
        isValid = false;
    }
    if (!data?.userStatus) {
        isValid = false;
    }
    return isValid;
}

function saveUser() {
    submitted.value = true;

    const data = {
        name: user?.value?.name?.trim(),
        email: user?.value.email?.trim(),
        phoneNumber: user?.value?.phoneNumber?.trim(),
        address: user?.value?.address?.trim(),
        password: user?.value?.password,
        confirmPassword: user?.value?.confirmPassword,
        userStatus: user?.value?.status
    };

    if (validateInput(data)) {
        if (user.value.id) {
            user.value.inventoryStatus = user.value.inventoryStatus.value ? user.value.inventoryStatus.value : user.value.inventoryStatus;
            products.value[findIndexById(user.value.id)] = user.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        } else {
            user.value.id = createId();
            user.value.code = createId();
            user.value.image = 'product-placeholder.svg';
            user.value.inventoryStatus = user.value.inventoryStatus ? user.value.inventoryStatus.value : 'INSTOCK';
            products.value.push(user.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        }

        productDialog.value = false;
        user.value = {};
    }
}

function editProduct(prod) {
    user.value = { ...prod };
    productDialog.value = true;
}

function confirmDeleteProduct(prod) {
    user.value = prod;
    deleteProductDialog.value = true;
}

function deleteProduct() {
    products.value = products.value.filter((val) => val.id !== user.value.id);
    deleteProductDialog.value = false;
    user.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
}

function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
}

function createId() {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

function exportCSV() {
    dt.value.exportCSV();
}

function confirmDeleteSelected() {
    deleteProductsDialog.value = true;
}

function deleteSelectedProducts() {
    products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
}

function getStatusLabel(status) {
    switch (status) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warn';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
}
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected"
                            :disabled="!selectedProducts || !selectedProducts.length" />
                </template>

                <template #end>
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedProducts"
                :value="products"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Products</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="code" header="Code" sortable style="min-width: 12rem"></Column>
                <Column field="name" header="Name" sortable style="min-width: 16rem"></Column>
                <Column header="Image">
                    <template #body="slotProps">
                        <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`"
                             :alt="slotProps.data.image" class="rounded" style="width: 64px" />
                    </template>
                </Column>
                <Column field="price" header="Price" sortable style="min-width: 8rem">
                    <template #body="slotProps">
                        {{ formatCurrency(slotProps.data.price) }}
                    </template>
                </Column>
                <Column field="category" header="Category" sortable style="min-width: 10rem"></Column>
                <Column field="rating" header="Reviews" sortable style="min-width: 12rem">
                    <template #body="slotProps">
                        <Rating :modelValue="slotProps.data.rating" :readonly="true" />
                    </template>
                </Column>
                <Column field="inventoryStatus" header="Status" sortable style="min-width: 12rem">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.inventoryStatus"
                             :severity="getStatusLabel(slotProps.data.inventoryStatus)" />
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2"
                                @click="editProduct(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger"
                                @click="confirmDeleteProduct(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="User detail" :modal="true">
            <div class="flex flex-col gap-6">
                <img v-if="user.image" :src="`https://primefaces.org/cdn/primevue/images/product/${user.image}`"
                     :alt="user.image" class="block m-auto pb-4" />
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <InputText id="name" v-model.trim="user.name" required="true" autofocus
                               :invalid="submitted && !user.name" fluid />
                    <small v-if="submitted && !user.name" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="email" class="block font-bold mb-3">Email</label>
                    <InputText id="email" v-model.trim="user.email" required="true" autofocus
                               :invalid="submitted  && validateEmail(user.email) !== ''" fluid />
                    <small v-if="submitted && validateEmail(user.email) !== ''"
                           class="text-red-500">{{ validateEmail(user.email) }}.</small>
                </div>
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <label for="phoneNumber" class="block font-bold mb-3">Phone number</label>
                        <InputText id="phoneNumber" v-model="user.phoneNumber" fluid
                                     :invalid="submitted && validatePhoneNumber(user.phoneNumber) !== ''" />
                        <small v-if="submitted && validatePhoneNumber(user.phoneNumber) !== ''"
                               class="text-red-500">{{ validatePhoneNumber(user.phoneNumber) }}.</small>
                    </div>

                    <div class="col-span-6">
                        <label for="address" class="block font-bold mb-3">Address</label>
                        <InputText id="address" v-model="user.address" fluid :invalid="submitted && !user.address" />
                        <small v-if="submitted && !user.address"
                               class="text-red-500">Address is required.</small>
                    </div>
                </div>
                <div>
                    <label for="passsword" class="block font-bold mb-3">Password</label>
                    <Password id="password" v-model="user.password" placeholder="Password" :toggleMask="true"
                              fluid :feedback="false"></Password>
                    <small v-if="submitted && passwordValidator(user.password) !== ''"
                           class="text-red-500">{{ passwordValidator(user.password) }}.</small>
                </div>
                <div>
                    <label for="confirmPassword" class="block font-bold mb-3">Confirm password</label>
                    <Password id="confirmPassword" v-model="user.confirmPassword" placeholder="Confirm password"
                              :toggleMask="true"
                              fluid :feedback="false"></Password>
                    <small v-if="submitted && validateCheckPassowrd(user.confirmPassword, user.password) !== ''"
                           class="text-red-500">{{ validateCheckPassowrd(user.confirmPassword, user.password) }}.</small>
                </div>
                <div>
                    <label for="userStatus" class="block font-bold mb-3">User Status</label>
                    <Select id="userStatus" v-model="user.status" :options="userStatuses" optionLabel="label"
                            placeholder="Select a Status" fluid></Select>
                    <small v-if="submitted && !user.status"
                           class="text-red-500">User status is required .</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveUser" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="user"
                >Are you sure you want to delete <b>{{ user.name }}</b
                >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteProduct" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="user">Are you sure you want to delete the selected products?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
            </template>
        </Dialog>
    </div>
</template>
