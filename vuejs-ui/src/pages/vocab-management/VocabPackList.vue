<script setup>

import { onMounted, ref, watch } from 'vue';
import { getPackageService } from '@/service/vocabulary/VocabularyService';
import { useRouter } from 'vue-router';

const router = useRouter();

const packages = ref([]);

const filterPackages = ref([]);

const searchQuery = ref('');

onMounted(() => {
    localStorage.removeItem('packageData');
    fetchGetPackageApi();
});

watch(searchQuery, (newSearchQuery) => {
    filterPackages.value = filteredPackagesFunction(newSearchQuery);
});

async function fetchGetPackageApi() {
    const params = {
        page: 1,
        size: 1000,
        sortBy: 'createdAt',
        direction: 'false',
        isPublished: true
    };
    try {
        const response = await getPackageService(params);
        const { data } = response;
        packages.value = data?.content;
        filterPackages.value = data?.content;
    } catch (e) {
        console.error(e);
    }
}

function navigateToPackageDetail(packageData) {
    localStorage.setItem('packageData', JSON.stringify(packageData));
    router.push({ name: 'vocab-pack-management-edit-package' });
}

function filteredPackagesFunction(searchKey) {
    if (searchKey === '') {
        return packages?.value;
    } else {
        // Lọc các package dựa trên từ khóa tìm kiếm
        return packages?.value?.filter((item) => {
            return (
                item?.name?.toLowerCase().includes(searchKey.toLowerCase()) || // Kiểm tra tên package
                item?.createBy?.toLowerCase().includes(searchKey.toLowerCase()) // Kiểm tra người tạo package
            );
        });
    }
}

</script>

<template>

    <div class="card">
        <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">Manage vocabulary</h4>
            <IconField>
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText v-model="searchQuery" placeholder="Search..." />
            </IconField>
        </div>

        <div>
            <Button @click="router.push({ name: 'vocab-pack-management-create-package' })">
                <i class="pi pi-plus"></i>
            </Button>
        </div>

        <div class="mt-16">
            <div
                v-for="(item, index) in filterPackages"
                :key="item.id"
                class="border rounded-md min-h-24 mb-4 hover:border-b-2 hover:border-blue-500 cursor-pointer"
                @click="navigateToPackageDetail(item)"
            >
                <div class="flex flex-wrap items-center mt-2 ml-2">
                    <p class="mr-4">{{ item?.words?.length }} words</p>
                    <div class="w-1 h-4 bg-current"></div>
                    <img
                        v-if="item.image"
                        :src="item.image"
                        class="inline-block h-8 w-8 rounded-full ring-2 ring-white ml-4"
                        alt="User avatar"
                    />
                    <img
                        v-else
                        src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?t=st=1729918577~exp=1729922177~hmac=185707299177428531797d03a47468ca7d8e4347364cf0215fd7821e2129005b&w=826"
                        class="inline-block h-8 w-8 rounded-full ring-2 ring-white ml-4"
                        alt="Placeholder image"
                    />
                    <p class="ml-4">{{ item?.createBy?.split('@')[0] }}</p>
                </div>
                <div class="ml-2 mt-2 font-bold text-lg">
                    <p>{{ item?.name || 'Untitled' }}</p>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped lang="scss">


</style>
