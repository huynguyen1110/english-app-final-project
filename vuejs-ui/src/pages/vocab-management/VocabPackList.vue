<script setup>

import { onMounted, ref } from 'vue';
import { getPackageService } from '@/service/vocabulary/VocabularyService';

const packages = ref([]);

onMounted(() => {
    fetchGetPackageApi()
})

async function fetchGetPackageApi () {
    const params = {
        page: 1,
        size: 1000,
        sortBy: 'createdAt',
        direction: 'false',
        isPublished: true
    };
    try {
        const response = await getPackageService(params);
        const {data} = response;
        packages.value = data?.content;
        console.log(packages?.value);
    } catch (e) {
        console.error(e);
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
                <InputText placeholder="Search..." />
            </IconField>
        </div>

        <div>
            <Button>
                <i class="pi pi-plus"></i>
            </Button>
        </div>

        <div class="mt-16">
            <div class="border rounded-md min-h-24">
                <div class="flex flex-wrap items-center mt-2 ml-2">
                    <p class="mr-4">2 words</p>
                    <div class="w-1 h-4 bg-current"></div>
                    <img class="inline-block h-8 w-8 rounded-full ring-2 ring-white ml-4" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                    <p class="ml-4">Huy6969</p>
                </div>
                <div class="ml-2 mt-2 font-bold text-lg"><p>Noun</p></div>
            </div>
        </div>
    </div>

</template>

<style scoped lang="scss">


</style>
