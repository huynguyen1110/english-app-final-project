<script setup>
import { ref } from 'vue';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { useEditor, EditorContent } from '@tiptap/vue-3';

const editor = useEditor({
    content: '<p>I’m running Tiptap with Vue.js. 🎉</p>',
    extensions: [
        StarterKit,
        Text,
        Heading.configure({
            levels: [1, 2, 3],
        }),
        Document,
        Paragraph,
        TextAlign.configure({
            types: ['heading', 'paragraph']
        }),
        Highlight]
});

</script>

<template>
    <div class="card">
        <div v-if="editor" class="container">
            <div class="control-group">
                <div class="button-group">
<!--                    <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"-->
<!--                            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">-->
<!--                        H1-->
<!--                    </button>-->
<!--                    <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"-->
<!--                            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">-->
<!--                        H2-->
<!--                    </button>-->
<!--                    <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"-->
<!--                            :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">-->
<!--                        H3-->
<!--                    </button>-->
                    <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
                        H1
                    </button>
                    <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
                        H2
                    </button>
                    <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
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
            <editor-content :editor="editor" />
        </div>
    </div>
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
    text-wrap: pretty;
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
</style>
