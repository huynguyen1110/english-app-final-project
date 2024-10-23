<script setup>
import { onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { getArticleContent } from '@/service/news/NewsService';
import { CATEGORY, SOURCE_NEWS_NAME } from '@/utils/Constaints';

const toast = useToast();

const display = ref(false);
const isEditing = ref(false);
let newsData = ref({});
let imageUrl = ref(null);
let title = ref('');
let description = ref('');
let content = ref(null);
let url = ref('');

const dropdownSourceNewsValue = ref(null);
const dropdownSourceNewsValues = ref([
    { name: SOURCE_NEWS_NAME.BBC_NEWS },
    { name: SOURCE_NEWS_NAME.FOX_NEWS },
    { name: SOURCE_NEWS_NAME.CNN_COM },
    { name: SOURCE_NEWS_NAME.GLOBAL_NEWS },
    { name: SOURCE_NEWS_NAME.TECH_CRUNCH }
]);

const dropdownCategoryValue = ref(null);
const dropdownCategoryValues = ref([
    { name: CATEGORY.EDUCATION.name, id: CATEGORY.EDUCATION.id },
    { name: CATEGORY.SCIENCE.name, id: CATEGORY.SCIENCE.id },
    { name: CATEGORY.BUSINESS.name, id: CATEGORY.BUSINESS.id },
    { name: CATEGORY.TRAVEL.name, id: CATEGORY.TRAVEL.id },
    { name: CATEGORY.SPORT.name, id: CATEGORY.SPORT.id },
    { name: CATEGORY.TECHNOLOGY.name, id: CATEGORY.TECHNOLOGY.id }
]);


onMounted(() => {
    const newsString = localStorage.getItem('news');
    newsData.value = JSON.parse(newsString);
    imageUrl.value = newsData.value?.urlToImage;
    title.value = newsData.value?.title;
    description.value = newsData.value?.description;
    url.value = newsData.value?.url;
    fetchGetArticleContent(url.value);
});

const fetchGetArticleContent = async (articleUrl) => {
    try {
        const response = await getArticleContent(articleUrl);
        const { data } = response;
        content.value = data;
    } catch (e) {
        console.log(e);
    }
};

const saveToTheSystemBtn = () => {
    display.value = true;
};

const saveBtn = () => {
    if (!dropdownCategoryValue.value && !dropdownSourceNewsValue.value) {
        toast.add({ severity: 'info', summary: 'Please select', life: 3000 });
        return;
    }
    display.value = false;
};

</script>

<template>
    <Dialog header="Save news to system setting" v-model:visible="display" :breakpoints="{ '960px': '75vw' }"
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
            <div :style="{height: '12px'}"></div>
            <div
                :style="{flexDirection: 'column', width: '100%', display: 'flex'}">
                <p :style="{fontSize: '20px'}">Select category:</p>
                <div :style="{width: '12px'}"></div>
                <Select v-model="dropdownCategoryValue" :options="dropdownCategoryValues" optionLabel="name"
                        placeholder="Select" />
            </div>
        </div>
        <template #footer>
            <Button label="Save" @click="saveBtn" />
        </template>
    </Dialog>
    <div class="card">
        <h6 class="title">{{ title }}</h6>
        <div :style="{height: '30px'}"></div>
        <div class="image-container">
            <img :style="{ alignSelf: 'center' }" :src="imageUrl" alt="Thumbnail Image" />
        </div>
        <div :style="{height: '30px'}"></div>
        <h6 class="title">{{ description }}</h6>
        <div :style="{height: '30px'}"></div>
        <Button @click="isEditing = !isEditing" >
            {{ isEditing ? 'Save' : 'Edit' }}
        </Button>
        <!-- Hiển thị nội dung (khi không chỉnh sửa) -->
        <div v-if="!isEditing" v-html="content" class="content"></div>
        <!-- Chế độ chỉnh sửa (khi đang chỉnh sửa) -->
        <div v-else>
            <textarea v-model="content" class="edit-content"></textarea>
        </div>        <p class="content"
           :style="{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', display: 'flex'}">
            <a :href="url" target="_blank">Click here to read more</a>
            <Button :style="{width: '15%'}" label="Save to the system" type="button" @click="saveToTheSystemBtn" />
        </p>
        <Toast/>
    </div>
</template>

<style scoped lang="scss">


.title {
    font-size: 24px; /* Thay đổi kích thước chữ */
    font-weight: bold; /* Làm chữ in đậm */
}

.image-container {
    display: flex; /* Sử dụng Flexbox cho thẻ chứa hình ảnh */
    justify-content: center; /* Căn giữa theo chiều ngang */
}

.content-container {
    margin: 20px; /* Khoảng cách bên ngoài */
}

.content {
    font-size: 16px; /* Kích thước chữ */
    line-height: 1.5; /* Khoảng cách giữa các dòng */
    color: #333; /* Màu chữ */
    text-align: justify; /* Căn đều hai bên */
    padding: 10px; /* Khoảng cách bên trong */
    background-color: #f9f9f9; /* Màu nền */
    border: 1px solid #ddd; /* Viền xung quanh */
    border-radius: 5px; /* Bo góc */
}
.edit-content {
    font-size: 16px; /* Kích thước chữ */
    line-height: 1.5; /* Khoảng cách giữa các dòng */
    color: #333; /* Màu chữ */
    text-align: justify; /* Căn đều hai bên */
    padding: 10px; /* Khoảng cách bên trong */
    background-color: #f9f9f9; /* Màu nền */
    border: 1px solid #ddd; /* Viền xung quanh */
    border-radius: 5px; /* Bo góc */
    width: 100%;
    min-height: 400px;
    box-sizing: border-box; /* Đảm bảo padding không làm thay đổi kích thước */
}
</style>
