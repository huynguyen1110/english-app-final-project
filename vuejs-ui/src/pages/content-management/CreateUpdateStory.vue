<script setup>
import { onMounted, ref } from 'vue';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Heading from '@tiptap/extension-heading';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import { useToast } from 'primevue/usetoast';
import { createStoryService, updateStoryService } from '@/service/content/ContentService';
import router from '@/router';

const toast = useToast();

const engTitle = ref(null);
const vnTitle = ref(null);
const content = ref(null);
const storyToEdit = ref(null);
const isEditing = ref(false);

onMounted(() => {
    getStoryToEditData();
});

const editor = useEditor({
    content: '<h1>Let create your content</h1>',
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

const saveContentData = async (storyToEdit) => {

    const storyDto = {
        vnTitle: vnTitle.value,
        engTitle: engTitle.value,
        content: editor.value.getText(),
        isDeleted: false
    };

    if (!storyDto.vnTitle || !storyDto.engTitle || !storyDto.content) {
        toast.add({ severity: 'info', summary: 'All fields can not be empty', life: 3000 });
        return; // Dừng lại nếu có bất kỳ trường nào là chuỗi rỗng
    }

    try {
        if (storyToEdit) {
            const { data } = await updateStoryService(storyDto, storyToEdit?.id);
            toast.add({
                severity: data ? 'success' : 'error',
                summary: data ? 'Saved successfully' : 'Failed to save',
                life: 3000
            });
            router.back();
            return;
        }

        const { data } = await createStoryService(storyDto);
        toast.add({
            severity: data ? 'success' : 'error',
            summary: data ? 'Saved successfully' : 'Failed to save',
            life: 3000
        });
        if (data) {
            router.back();
        }
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Failed to save', life: 3000 });
        console.error(e);
    }
};


const getStoryToEditData = () => {
    storyToEdit.value = JSON.parse(localStorage.getItem('storyToEdit'));
    if (!storyToEdit.value) {
        return;
    }
    vnTitle.value = storyToEdit.value?.vnTitle;
    engTitle.value = storyToEdit.value?.engTitle;
    content.value = storyToEdit.value?.content;
};

const editBtn = () => {
    isEditing.value = !isEditing.value;
    editor.value.commands.setContent(content.value);
};

const saveEditContent = () => {
    isEditing.value = !isEditing.value;
    content.value = editor.value.getJSON();
    console.log(content.value);
};

</script>

<template>
    <div class="card">
        <Toolbar>
            <template #end>
                <Button @click="saveContentData(storyToEdit)">Save</Button>
            </template>
        </Toolbar>

        <div class="w-full mt-4">
            <p>English title</p>
            <InputText v-model="engTitle" class="w-full" />
        </div>
        <div class="w-full mt-4">
            <p>Vietnamese title</p>
            <InputText v-model="vnTitle" class="w-full" />
        </div>
        <div v-if="grammarToEdit" class="mt-6">
            <Button v-if="isEditing" @click="saveEditContent">
                Save
            </Button>
            <Button v-else @click="editBtn">
                Edit
            </Button>
        </div>
        <div v-if="storyToEdit" class="mt-6">
            <Button v-if="isEditing" @click="saveEditContent">
                Save
            </Button>
            <Button v-else @click="editBtn">
                Edit
            </Button>
        </div>
        <div class="mt-6" v-if="!storyToEdit || isEditing">
            <div v-if="editor" class="content-container mt-6">
                <div class="control-group">
                    <label>Content:</label>
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
        <div v-else class="mt-6">
            <p class="mb-2">Content:</p>
            <div class="prose" v-html="content"></div>
        </div>
    </div>
    <Toast />
</template>

<style scoped lang="scss">
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
