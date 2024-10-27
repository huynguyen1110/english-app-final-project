<script setup>
import { onMounted, ref } from 'vue';
import { getImageFromGoogleService } from '@/service/third-party/ThirdParyService';
import { useToast } from 'primevue/usetoast';
import {
    addWordToPackageService,
    createPackageService,
    createWordService, deletePackageService, removeWordFromPackageService, updatePackageService
} from '@/service/vocabulary/VocabularyService';
import { decodeJWT } from '@/service/auth/AuthService';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();

onMounted(() => {
    packageData.value = JSON.parse(localStorage.getItem('packageData'));
    getPackageData();
});

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

const wordsToRemove = ref([]);
const packageName = ref('');
const description = ref('');
const imageFromGoogle = ref(null);
const userEmail = ref('');
const packageData = ref(null);

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

function deleteRow(wordToRemove) {
    words.value = words.value.filter(word => word.id !== wordToRemove?.id);
    wordsToRemove.value.push(wordToRemove);
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

//save data when edit is finished
async function saveEdit() {
    try {

        if (wordsToRemove.value.length > 0) {
            await Promise.all(
                wordsToRemove.value.map(async (word) => {
                    if (word?.wordId) {
                        try {
                            await removeWordFromPackageService(word?.wordId, packageData?.value?.id);
                        } catch (error) {
                            console.error('Error creating word:', error);
                        }
                    }
                })
            );
        }

        const packageDto = {
            name: packageName?.value,
            description: description?.value,
            isPublished: true
        };

        const { data } = await updatePackageService(packageDto, packageData?.value?.id);

        const wordsId = [];

        if (packageData?.value?.id) {
            await Promise.all(
                words.value.map(async (word) => {
                    if (!word?.wordId) {
                        try {
                            const { data: createdWord } = await createWordService(word);
                            if (createdWord?.wordId) wordsId.push(createdWord.wordId);
                        } catch (error) {
                            console.error('Error creating word:', error);
                        }
                    }
                })
            );
        }

        if (wordsId.length > 0) {
            const addWordResponses = await Promise.all(
                wordsId.map(async (wordId) => {
                    try {
                        const { data: addedWord } = await addWordToPackageService(wordId, packageData?.value?.id);
                        return addedWord;
                    } catch (error) {
                        console.error('Error adding word to package:', error);
                        return null;
                    }
                })
            );

            const allWordsAdded = addWordResponses.every(response => response);
            if (allWordsAdded) {
                toast.add({ severity: 'success', summary: 'Package edited!', life: 3000 });
                router.back();
                return;
            } else {
                toast.add({ severity: 'error', summary: 'Failed to edit package!', life: 3000 });
            }
        }
        if (data) {
            toast.add({ severity: 'success', summary: 'Package edited!', life: 3000 });
            router.back();
        } else {
            toast.add({ severity: 'error', summary: 'Failed to edit package!', life: 3000 });
        }
    } catch (error) {
        console.error('Error editing package:', error);
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

function getPackageData() {
    if (!packageData.value) {
        return;
    }
    packageName.value = packageData?.value?.name;
    description.value = packageData?.value?.description;
    words.value = packageData?.value?.words?.map((word, index) => ({
        ...word,
        id: index + 1 // Hoặc bạn có thể dùng `Math.random()` hoặc `Date.now()` để tạo id duy nhất
    }));
}

async function deletePackage() {
    const userConfirmed = confirm('Are you sure you want to delete this package?');

    if (userConfirmed) {
        try {
            const { data } = await deletePackageService(packageData?.value?.id);
            if (data) {
                toast.add({ severity: 'success', summary: 'Deleted package', life: 3000 });
                router.back();
            } else {
                toast.add({ severity: 'error', summary: 'Failed to delete package', life: 3000 });
            }
        } catch (e) {
            console.error(e);
        }
    } else {
        // Hủy xóa gói
        console.log('Delete canceled.');
    }
}

</script>

<template>

    <div class="card">
        <div class="flex justify-between items-center">
            <div>
                <p v-if="!packageData" class="font-bold text-xl">Create news your new package</p>
                <p v-else class="font-bold text-xl">Edit your package</p>
            </div>
            <div>
                <Button v-if="!packageData" @click="save">Save</Button>
                <div v-else>
                    <Button class="mr-4" @click="deletePackage">Delete package</Button>
                    <Button @click="saveEdit">Save</Button>
                </div>
            </div>
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
                        <button class="mr-4" @click="deleteRow(word)">
                            <i class="pi pi-trash" />
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
