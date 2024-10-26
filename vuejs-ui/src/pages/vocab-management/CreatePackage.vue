<script setup>
import { ref } from 'vue';
import { getImageFromGoogleService } from '@/service/third-party/ThirdParyService';

const words = ref([
    { id: 0, name: 'Hello', meaning: 'xin chao', image: 'ddddd', showImage: false }
]);

const imageFromGoogle = ref(null);

function addRow() {
    words.value.push({
        id: words.value.length, // Tạo id duy nhất
        name: '',
        meaning: '',
        image: '',
        showImage: false
    });
}

function deleteRow(id) {
    words.value = words.value.filter(word => word.id !== id);
}

function save() {
    console.log(words.value);
}

function toggleImage(word) {
    word.showImage = !word.showImage;
    if (word.showImage) {
        fetchGetImagesFromGoogle(word?.name);
    }
}

async function fetchGetImagesFromGoogle(keyWord) {
    try {
        const response = await getImageFromGoogleService(keyWord)
        const { data } = response;
        console.log("images:", data);
    } catch (e) {
        console.error(e);
    }
}

</script>

<template>

    <div class="card">
        <div class="flex justify-between items-center">
            <p class="font-bold text-xl">Create news your new package</p>
            <Button @click="save">Save</Button>
        </div>
        <div class="mt-6">
            <FloatLabel>
                <InputText multiple class="w-full rounded-md" id="packageName" type="text" />
                <label for="packageName">Package name</label>
            </FloatLabel>

            <FloatLabel class="mt-8">
                <Textarea :autoResize="true" rows="3" cols="40" />
                <label for="packageName">Description</label>
            </FloatLabel>
        </div>

        <div class="mt-10"><p>Words:</p></div>

        <div class="mt-2">
            <div v-for="(word, index) in words" :key="word.id">
                <div class="rounded-md min-h-40 border-2 mt-6">
                    <div class="min-h-12 flex justify-between items-center">
                        <div class="ml-4">{{ index + 1 }}</div>
                        <button class="mr-4" @click="deleteRow(word?.id)">
                            <InputIcon>
                                <i class="pi pi-trash" />
                            </InputIcon>
                        </button>
                    </div>
                    <div class="border-b-4 border-indigo-500"></div>
                    <div class="min-h-36 flex items-center justify-between ml-4 mr-4">
                        <FloatLabel class="w-2/5 h-12">
                            <InputText :id="'word-' + word.id" class="w-full h-12" v-model="word.name" />
                            <label :for="'word-' + word.id">Word</label>
                        </FloatLabel>
                        <FloatLabel class="w-2/5 h-12">
                            <InputText :id="'meaning-' + word.id" class="w-full h-12" v-model="word.meaning" />
                            <label :for="'meaning-' + word.id">Meaning</label>
                        </FloatLabel>
                        <div class="border-dashed w-40 h-16 border-2 flex items-center justify-center">
                            <button @click="toggleImage(word)">
                                <i class="pi pi-image" style="font-size: 3rem" />
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="word?.showImage" class="rounded-md min-h-40 border-2 mb-2">
                    <div>Hinh anh</div>
                </div>
            </div>


            <div class="flex items-center justify-end mt-6">
                <Button @click="addRow">
                    <i class="pi pi-plus"></i>
                </Button>
            </div>
        </div>
    </div>

</template>

<style scoped lang="scss">

</style>
