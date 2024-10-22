<script setup>
import { onMounted, ref } from 'vue';

let newsData = ref({});
let imageUrl = ref(null);
let title = ref('');
let description = ref('');
let content = ref('');
let url = ref('');

onMounted(() => {
    const newsString = localStorage.getItem('news');
    newsData.value = JSON.parse(newsString);
    imageUrl.value = newsData.value?.urlToImage;
    title.value = newsData.value?.title;
    description.value = newsData.value?.description;
    content.value = newsData.value?.content;
    url.value = newsData.value?.url;
});

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
