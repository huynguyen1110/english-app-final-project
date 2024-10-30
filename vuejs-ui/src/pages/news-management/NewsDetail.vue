<script setup>
import { onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { createNewsService, getArticleContent } from '@/service/news/NewsService';
import { CATEGORY, SOURCE_NEWS_NAME } from '@/utils/Constaints';
import { EditorContent, useEditor } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Text from '@tiptap/extension-text';
import Heading from '@tiptap/extension-heading';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';

const toast = useToast();

const display = ref(false);
const isEditing = ref(false);
let newsData = ref({});
let imageUrl = ref(null);
let title = ref('');
let description = ref('');
let content = ref(null);
let url = ref('');
let author = ref('');
let publishedAt = ref('');

const editor = useEditor({
    content: content.value,
    extensions: [
        StarterKit,
        Text,
        Heading.configure({
            levels: [1, 2, 3]
        }),
        Document,
        Paragraph,
        TextAlign.configure({
            types: ['heading', 'paragraph']
        }),
        Highlight],
    editorProps: {
        attributes: {
            class: 'prose max-w-none [&_ol]:list-decimal [&_ul]:list-disc'
        }
    }
});

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
    author.value = newsData.value?.author;
    publishedAt.value = newsData.value?.publishedAt;
    content.value = newsData.value?.content;
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

const saveBtn = async () => {
    if (!dropdownCategoryValue.value && !dropdownSourceNewsValue.value) {
        toast.add({ severity: 'info', summary: 'Please select', life: 3000 });
        return;
    }
    const newsDto = {
        title: title?.value,
        content: JSON.stringify(content?.value),
        sourceName: dropdownSourceNewsValue?.value?.name,
        description: description?.value,
        author: author?.value,
        imageUrl: imageUrl?.value,
        sourceUrl: url?.value,
        publishedAt: publishedAt?.value,
        topicId: dropdownCategoryValue?.value?.id
    };
    try {
        const response = await createNewsService(newsDto);
        const { data } = response;
        if (data) {
            toast.add({ severity: 'success', summary: 'Add to system successfully', life: 3000 });
        } else {
            toast.add({ severity: 'warn', summary: 'Failed to add to system', life: 3000 });
        }
    } catch (e) {
        toast.add({ severity: 'warn', summary: 'Failed to add to system', life: 3000 });
        console.error(e);
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
        <Button @click="() => {
            isEditing = !isEditing;
            console.log(isEditing)
            if (isEditing) {
                editor.commands.setContent(content);
                return;
            }
            content = editor.getHTML();
        }">
            {{ isEditing ? 'Save' : 'Edit' }}
        </Button>
        <!-- Hiển thị nội dung (khi không chỉnh sửa) -->
        <div v-if="!isEditing" class="content">
            <div v-html="content" class="prose"></div>
        </div>
        <!-- Chế độ chỉnh sửa (khi đang chỉnh sửa) -->
        <div v-else>
            <div v-if="editor" class="content-container mt-6">
                <div class="control-group">
                    <div class="button-group">
                        <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                                :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
                            H1
                        </button>
                        <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                                :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
                            H2
                        </button>
                        <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                                :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
                            H3
                        </button>
                        <button @click="editor.chain().focus().setParagraph().run()"
                                :class="{ 'is-active': editor.isActive('paragraph') }">
                            Paragraph
                        </button>
                        <button @click="editor.chain().focus().toggleBold().run()"
                                :class="{ 'is-active': editor.isActive('bold') }">
                            Bold
                        </button>
                        <button @click="editor.chain().focus().toggleItalic().run()"
                                :class="{ 'is-active': editor.isActive('italic') }">
                            Italic
                        </button>
                        <button @click="editor.chain().focus().toggleStrike().run()"
                                :class="{ 'is-active': editor.isActive('strike') }">
                            Strike
                        </button>
                        <button @click="editor.chain().focus().toggleHighlight().run()"
                                :class="{ 'is-active': editor.isActive('highlight') }">
                            Highlight
                        </button>
                        <button @click="editor.chain().focus().setTextAlign('left').run()"
                                :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">
                            Left
                        </button>
                        <button @click="editor.chain().focus().setTextAlign('center').run()"
                                :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }">
                            Center
                        </button>
                        <button @click="editor.chain().focus().setTextAlign('right').run()"
                                :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }">
                            Right
                        </button>
                        <button @click="editor.chain().focus().setTextAlign('justify').run()"
                                :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }">
                            Justify
                        </button>
                    </div>
                </div>
                <editor-content class="content-editor-style mt-2" :editor="editor" />
            </div>
        </div>

        <p class="content"
           :style="{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', display: 'flex'}">
            <a :href="url" target="_blank">Click here to read more</a>
            <Button :style="{width: '15%'}" label="Save to the system" type="button" @click="saveToTheSystemBtn" />
        </p>
        <Toast />
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

/* Basic editor styles */
:first-child {
    margin-top: 0;
}

/* List styles */
ul,
ol {
    padding: 0 1rem;
    margin: 1.25rem 1rem 1.25rem 0.4rem;

    li p {
        margin-top: 0.25em;
        margin-bottom: 0.25em;
    }
}

/* Heading styles */
h1,
h2,
h3,
h4,
h5,
h6 {
    line-height: 1.1;
    margin-top: 2.5rem;
    //text-wrap: pretty;
    white-space: pre-line;
}

h1,
h2 {
    margin-top: 3.5rem;
    margin-bottom: 1.5rem;
}

h1 {
    font-size: 1.4rem;
}

h2 {
    font-size: 1.2rem;
}

h3 {
    font-size: 1.1rem;
}

h4,
h5,
h6 {
    font-size: 1rem;
}

/* Code and preformatted text styles */
code {
    background-color: var(--purple-light);
    border-radius: 0.4rem;
    color: var(--black);
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
}

pre {
    background: var(--black);
    border-radius: 0.5rem;
    color: var(--white);
    font-family: 'JetBrainsMono', monospace;
    margin: 1.5rem 0;
    padding: 0.75rem 1rem;

    code {
        background: none;
        color: inherit;
        font-size: 0.8rem;
        padding: 0;
    }
}

mark {
    background-color: #FAF594;
    border-radius: 0.4rem;
    box-decoration-break: clone;
    padding: 0.1rem 0.3rem;
}

blockquote {
    border-left: 3px solid var(--gray-3);
    margin: 1.5rem 0;
    padding-left: 1rem;
}

hr {
    border: none;
    border-top: 1px solid var(--gray-2);
    margin: 2rem 0;
}

.button-group {
    display: flex; /* Sắp xếp các nút theo hàng */
    gap: 10px; /* Khoảng cách giữa các nút */
    background-color: #f0f0f0; /* Màu nền cho nhóm nút */
    border-radius: 8px; /* Đường viền tròn cho nhóm */
    padding: 10px; /* Khoảng cách bên trong cho nhóm */
}

.button-group button {
    background-color: #ffffff; /* Màu nền mặc định cho các nút */
    border: none; /* Không có viền */
    border-radius: 4px; /* Đường viền tròn cho các nút */
    padding: 10px 15px; /* Khoảng cách bên trong cho các nút */
    cursor: pointer; /* Thay đổi con trỏ khi di chuột vào nút */
    transition: background-color 0.3s ease, color 0.3s ease; /* Hiệu ứng chuyển màu mượt mà */
}

.button-group button:hover {
    background-color: #d1c4e9; /* Màu nền khi hover */
}

.button-group button.is-active {
    background-color: #9b59b6; /* Màu nền tím khi nút đang hoạt động */
    color: white; /* Màu chữ trắng khi nút đang hoạt động */
}

.content-editor-style {
    border-width: 2px;
    border-radius: 10px;
    min-height: 250px;
}
</style>
