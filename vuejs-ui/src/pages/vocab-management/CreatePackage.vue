<script setup>
import { ref } from 'vue';
import { getImageFromGoogleService } from '@/service/third-party/ThirdParyService';
import { useToast } from 'primevue/usetoast';
import {
    addWordToPackageService,
    createPackageService,
    createWordService
} from '@/service/vocabulary/VocabularyService';
import { decodeJWT } from '@/service/auth/AuthService';
import { useRouter } from 'vue-router';
const router = useRouter();

const toast = useToast();

const words = ref([
    {
        id: 0, // Tạo id duy nhất
        name: '',
        meaning: '',
        description: '',
        wordType: '',
        audio: '',
        image: '',
        phonetic: '',
        example: '',
        showImage: false
    }
]);
const packageName = ref('');
const description = ref('');
const imageFromGoogle = ref(null);
const userEmail = ref('');

function addRow() {
    words.value.push({
        id: words.value.length, // Tạo id duy nhất
        name: '',
        meaning: '',
        description: '',
        wordType: '',
        audio: '',
        image: '',
        phonetic: '',
        example: '',
        showImage: false
    });
}

function deleteRow(id) {
    words.value = words.value.filter(word => word.id !== id);
}

async function save() {

    const token = localStorage.getItem('jwt').toString();
    const wordsId = [];
    if (token) {
        const decodedToken = decodeJWT(token);
        userEmail.value = decodedToken.sub;
    }

    const packageData = {
        name: packageName?.value,
        description: description?.value,
        isPublished: true
    };

    if (packageData?.name === '' || packageData?.description === '') {
        toast.add({ severity: 'error', summary: 'Input field can not be empty', life: 3000 });
        return;
    }

    try {
        const { data } = await createPackageService(packageData, userEmail?.value);
        const packageId = data?.id;
        if (packageId) {
            await Promise.all(words.value.map(async (word) => {
                try {
                    const response = await createWordService(word);
                    const { data } = response;

                    // Ensure data exists and wordId is available before pushing
                    if (data && data?.wordId) {
                        wordsId.push(data.wordId);
                    }
                } catch (e) {
                    console.error('Error creating word:', e);
                }
            }));
        }
        if (wordsId.length > 0) {
            const addWordToPackageResponses = await Promise.all(wordsId?.map(async (wordId) => {
                try {
                    const response = await addWordToPackageService(wordId, packageId);
                    const { data } = response;
                    return data;
                } catch (e) {
                    console.error('Error creating word:', e);
                    return;
                }
            }));
            if (addWordToPackageResponses) {
                toast.add({ severity: 'success', summary: 'Package created!', life: 3000 });
                router.back();
            } else {
                toast.add({ severity: 'error', summary: 'Failed to create package!', life: 3000 });
            }
        }
    } catch (e) {
        console.error('Error creating package:', e);
    }

}

function toggleImage(word) {
    word.showImage = !word.showImage;
    if (word.showImage) {
        fetchGetImagesFromGoogle(word?.name);
    }
}

async function fetchGetImagesFromGoogle(keyWord) {
    try {
        const response = await getImageFromGoogleService(keyWord);
        const { data } = response;
        imageFromGoogle.value = data;
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
                <InputText v-model="packageName" multiple class="w-full rounded-md" id="packageName" type="text" />
                <label for="packageName">Package name</label>
            </FloatLabel>

            <FloatLabel class="mt-8">
                <Textarea v-model="description" :autoResize="true" rows="3" cols="40" />
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
                            <div v-if="word?.image" class="relative">
                                <img class="w-40 h-16" :src="word?.image" />
                                <i class="pi pi-trash trash-icon absolute top-1 right-1 cursor-pointer"
                                   @click="word.image = ''"></i>
                            </div>

                            <div v-else>
                                <button @click="toggleImage(word)">
                                    <i class="pi pi-image" style="font-size: 3rem" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="word?.showImage" class="rounded-md min-h-40 border-2 mb-2 image-container">
                    <img v-for="(image, index) in imageFromGoogle?.images"
                         :key="index"
                         :src="image?.imageUrl"
                         alt="Image"
                         @click="() => {
                             word.image = image.imageUrl;
                             word.showImage = false;
                         }" />
                </div>
            </div>


            <div class="flex items-center justify-end mt-6">
                <Button @click="addRow">
                    <i class="pi pi-plus"></i>
                </Button>
            </div>
        </div>
    </div>
    <Toast />
</template>

<style scoped lang="scss">

.image-container {
    display: flex;
    overflow-x: auto; /* Tạo thanh cuộn ngang */
    white-space: nowrap; /* Tránh xuống dòng các ảnh */
    gap: 8px; /* Khoảng cách giữa các ảnh */
    align-items: center;
}

.image-container img {
    max-height: 100px; /* Điều chỉnh kích thước ảnh */
    border-radius: 8px;
    margin-left: 1rem;
    margin-right: 1rem;
    transition: border-color 0.3s ease; /* Hiệu ứng chuyển đổi viền mượt */
    cursor: pointer; /* Con trỏ chuột mặc định thành hình tay */
}

.image-container img:hover {
    border: 2px solid yellow; /* Viền màu vàng khi hover */
}

.trash-icon {
    font-size: 1.5rem;
    color: white;
    background-color: rgba(0, 0, 0, 0.6); /* Nền đen nhạt */
    border-radius: 50%;
    padding: 0.3rem;
    transition: background-color 0.3s; /* Hiệu ứng chuyển màu */
}

.trash-icon:hover {
    background-color: yellow; /* Đổi nền thành màu vàng khi hover */
    color: black; /* Đổi màu icon thành đen để nổi bật trên nền vàng */
}
</style>
