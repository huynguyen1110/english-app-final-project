<script setup>
import { onMounted, ref } from 'vue';
import { getArticleContent } from '@/service/news/NewsService';

let newsData = ref({});
let imageUrl = ref(null);
let title = ref('');
let description = ref('');
let contentArticle = ref(null);
let content = ref(null);
let url = ref('');

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
        content.value = JSON.stringify(data);
        console.log(content.value)
    } catch (e) {
        console.log(e);
    }
};

</script>

<template>
    <div class="card">
        <h6 class="title">{{ title }}</h6>
        <div :style="{height: '30px'}"></div>
        <div class="image-container">
            <img :style="{ alignSelf: 'center' }" :src="imageUrl" alt="Thumbnail Image" />
        </div>
        <div :style="{height: '30px'}"></div>
        <h6 class="title">{{ description }}</h6>
        <div :style="{height: '30px'}"></div>

        <div>
            {{contentArticle?.value}}
        </div>
        <p class="content">
            <a :href="url" target="_blank">Click here to read more</a>
        </p>

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
</style>
