<script setup>
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import {
    getAllUsersService,
    passwordValidator, registerService, updateUserService,
    validateCheckPassowrd,
    validateEmail,
    validatePhoneNumber
} from '@/service/auth/AuthService';
import { USER_ROLE, USER_STATUSES } from '@/Constaints/Constaints';
import { format } from 'date-fns';

onMounted(() => {
    ProductService.getProducts().then((data) => (products.value = data));
    fetchGetAllUsersApi();
});

const toast = useToast();
const dt = ref();
const products = ref();
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const user = ref({});
const usersData = ref([]);
const hidePasswordField = ref(false);
const selectedProducts = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

const userStatuses = ref([
    { label: 'ACTIVE', value: USER_STATUSES.ACTIVE },
    { label: 'IS DELETE', value: USER_STATUSES.IS_DELIVERED }
]);

function formatCurrency(value) {
    if (value) return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return;
}

function formatDate(dateString) {
    return format(new Date(dateString), 'dd/MM/yyyy'); // định dạng theo kiểu dd/MM/yyyy
}

function openNew() {
    user.value = {};
    submitted.value = false;
    hidePasswordField.value = false;
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
    if (!data?.status) {
        isValid = false;
    }
    if (data?.role?.length === 0) {
        isValid = false;
    }
    return isValid;
}

async function fetRegisterApi(registerDto) {
    try {
        const response = await registerService(registerDto);
        const { data } = response;
        console.log(data);
        if (data) {
            toast.add({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
        }
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Failed to create user', detail: e.message, life: 3000 });
    }
}

async function fetchGetAllUsersApi() {
    try {
        const params = {
            page: 1,
            size: 1000,
            sortField: 'username',
            sortDirection: 'true'
        };
        const response = await getAllUsersService(params);
        const { data } = response;
        usersData.value = data.content;
    } catch (e) {
        console.error('err while getting users', e);
    }
}

async function fetchUpdateUserApi(updateUserDto) {
    try {
        const response = await updateUserService(updateUserDto);
        const { data } = response;
        console.log(data);
        if (data) {
            toast.add({ severity: 'success', summary: 'Successful', detail: 'User updated', life: 3000 });
        }
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Failed to update user', detail: e.message, life: 3000 });
    }
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
        status: user?.value?.status?.value,
        roles: user?.value?.roles
    };

    if (validateInput(data)) {
        if (user?.value?.email) {
            // user.value.inventoryStatus = user.value.inventoryStatus.value ? user.value.inventoryStatus.value : user.value.inventoryStatus;
            // products.value[findIndexById(user.value.id)] = user.value;
            delete data.password;
            fetchUpdateUserApi(data);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        } else {
            fetRegisterApi(data);
        }

        productDialog.value = false;
        user.value = {};
    }
}

function editUser(userData) {
    user.value = { ...userData };
    delete user?.value?.password;

    // Cập nhật userStatus
    user.value.status = userData?.userStatus;
    user.value.name = userData?.username;

    hidePasswordField.value = true;
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
        case USER_STATUSES.ACTIVE:
            return 'success';

        case USER_STATUSES.IS_DELIVERED:
            return 'danger';

        case USER_ROLE.SUPER_ADMIN:
            return 'success';

        case USER_ROLE.ADMIN:
            return 'warn';

        case USER_ROLE.USER:
            return 'secondary';

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
                :value="usersData"
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
                        <h4 class="m-0">Manage Users</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
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
                <Column field="inventoryStatus" header="Status" style="min-width: 12rem">
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
                                @click="confirmDeleteProduct(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="User detail" :modal="true">
            <div class="flex flex-col gap-6">
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
                <div v-if="!hidePasswordField">
                    <label for="passsword" class="block font-bold mb-3">Password</label>
                    <Password id="password" v-model="user.password" placeholder="Password" :toggleMask="true"
                              fluid :feedback="false"></Password>
                    <small v-if="submitted && passwordValidator(user.password) !== ''"
                           class="text-red-500">{{ passwordValidator(user.password) }}.</small>
                </div>
                <div v-if="!hidePasswordField">
                    <label for="confirmPassword" class="block font-bold mb-3">Confirm password</label>
                    <Password id="confirmPassword" v-model="user.confirmPassword" placeholder="Confirm password"
                              :toggleMask="true"
                              fluid :feedback="false"></Password>
                    <small v-if="submitted && validateCheckPassowrd(user.confirmPassword, user.password) !== ''"
                           class="text-red-500">{{ validateCheckPassowrd(user.confirmPassword, user.password)
                        }}.</small>
                </div>
                <div>
                    <label for="userStatus" class="block font-bold mb-3">User Status</label>
                    <Select id="userStatus" v-model="user.status" :options="userStatuses" optionLabel="label"
                            placeholder="Select a Status" fluid></Select>
                    <small v-if="submitted && !user.status"
                           class="text-red-500">User status is required .</small>
                </div>
                <div class="font-semibold text-xl">User role</div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex items-center">
                        <Checkbox id="checkOption1" name="option" :value="USER_ROLE.USER" v-model="user.roles" />
                        <label for="checkOption1" class="ml-2">User</label>
                    </div>
                    <div class="flex items-center">
                        <Checkbox id="checkOption2" name="option" :value="USER_ROLE.ADMIN" v-model="user.roles" />
                        <label for="checkOption2" class="ml-2">Admin</label>
                    </div>
                    <div class="flex items-center">
                        <Checkbox id="checkOption3" name="option" :value=USER_ROLE.SUPER_ADMIN
                                  v-model="user.roles" />
                        <label for="checkOption3" class="ml-2">Super admin</label>
                    </div>
                </div>
                <small class="text-red-500" v-if="submitted && !user.roles">User role is required</small>
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
