import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import MainAdmin from '@/pages/MainAdmin.vue';
import { USER_ROLE as USER_ROLES } from '@/Constaints/Constaints';
import { decodeToken } from '@/service/auth/AuthService';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            // component: AppLayout,
            component: MainAdmin,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: { requiresAuth: true, roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN] }
                },
                {
                    path: '/v1/super-admin/user-management',
                    name: 'user-management',
                    component: () => import('@/pages/user-management/UserManagement.vue'),
                    meta: { requiresAuth: true, roles: [USER_ROLES.SUPER_ADMIN] }
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/InputDoc.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/ButtonDoc.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/TableDoc.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/ListDoc.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/TreeDoc.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/PanelsDoc.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/OverlayDoc.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/MediaDoc.vue')
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/MessagesDoc.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/FileDoc.vue')
                },
                {
                    path: '/uikit/menu',
                    name: 'menu',
                    component: () => import('@/views/uikit/MenuDoc.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/ChartDoc.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/MiscDoc.vue')
                },
                {
                    path: '/uikit/timeline',
                    name: 'timeline',
                    component: () => import('@/views/uikit/TimelineDoc.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/pages/Documentation.vue')
                }
            ]
        },
        {
            path: '/v1/auth/register',
            name: 'register',
            component: () => import('@/pages/auth/Register.vue')
        },
        {
            path: '/v1/auth/login',
            name: 'login',
            component: () => import('@/pages/auth/Login.vue')
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login1',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

// Navigation Guard kiểm tra quyền truy cập
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('jwt'); // Lấy JWT từ localStorage
    if (token) {
        try {
            const decodedToken = decodeToken(token); // Giải mã JWT
            const userRole = decodedToken?.role; // Lấy role từ payload của JWT

            // Kiểm tra nếu route yêu cầu quyền truy cập
            if (to.matched.some(record => record.meta.requiresAuth)) {
                // Kiểm tra xem role của người dùng có được phép truy cập route này hay không
                if (to.meta.roles && !to.meta.roles.some(role => userRole.includes(role))) {
                    // Nếu không có quyền, điều hướng đến trang login hoặc trang khác
                    next({ name: 'login' });
                } else {
                    // Nếu có quyền, tiếp tục điều hướng
                    next();
                }
            } else {
                // Nếu route không yêu cầu quyền, tiếp tục điều hướng
                next();
            }
        } catch (error) {
            console.error('Invalid token', error);
            next({ name: 'login' }); // Nếu token không hợp lệ, điều hướng đến trang login
        }
    } else {
        // Nếu không có token, điều hướng đến trang login nếu route yêu cầu xác thực
        if (to.matched.some(record => record.meta.requiresAuth)) {
            next({ name: 'login' });
        } else {
            next(); // Nếu không yêu cầu xác thực, tiếp tục điều hướng
        }
    }
});

export default router;
