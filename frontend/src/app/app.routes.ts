import { Routes } from '@angular/router';
import { IntroComponent } from './pages/intro/intro.component';
import { HomeComponent } from './pages/main/pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { MainComponent } from './pages/main/main.component';
import { UsuarioComponent } from './pages/main/pages/usuario/usuario.component';
import { ProductDetailsComponent } from './pages/main/pages/product-details/product-details.component';
import { UserInfoComponent } from './pages/main/pages/usuario/pages/user-info/user-info.component';
import { UserProductsComponent } from './pages/main/pages/usuario/pages/user-products/user-products.component';
import { WinningBidsComponent } from './pages/main/pages/cart/pages/winning-bids/winning-bids.component';
import { LosingBidsComponent } from './pages/main/pages/cart/pages/losing-bids/losing-bids.component';
import { CartComponent } from './pages/main/pages/cart/cart.component';
import { ProductFormComponent } from './pages/main/pages/product-form/product-form.component';
import { AdminComponent } from './pages/main/pages/admin/admin.component';
import { UserDetailsComponent } from './pages/main/pages/admin/pages/user-details/user-details.component';
import { UsersComponent } from './pages/main/pages/admin/pages/users/users.component';
import { UserBidsComponent } from './pages/main/pages/admin/pages/user-bids/user-bids.component';
import { CreateUserComponent } from './pages/main/pages/admin/pages/create-user/create-user.component';

export const routes: Routes = [
    {
        path: '',
        component: IntroComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'main',
        component: MainComponent,
        children: [
            {
                path: 'admin',
                component: AdminComponent,
                children: [
                    {
                        path: 'users',
                        component: UsersComponent
                    },
                    {
                        path: 'user/:id',
                        component: UserDetailsComponent,
                    },
                    {
                        path: 'products/:id',
                        component: UserProductsComponent,
                    },
                    {
                        path: 'bids/:id',
                        component: UserBidsComponent
                    },
                    {
                        path: 'user-form/:id',
                        component: UserInfoComponent
                    },
                    {
                        path: 'user-form',
                        component: CreateUserComponent
                    }
                ]
            },
            {
                path: 'cart',
                component: CartComponent,
                children: [
                    {
                        path: 'winning-bids',
                        component: WinningBidsComponent
                    },
                    {
                        path: 'losing-bids',
                        component: LosingBidsComponent
                    },
                ]
            },
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: 'product/:id',
                component: ProductDetailsComponent
            },
            {
                path: 'product-form',
                component: ProductFormComponent
            },
            {
                path: 'product-form/:id',
                component: ProductFormComponent
            },
            {
                path: 'profile',
                component: UsuarioComponent,
                children: [
                    {
                        path: 'info',
                        component: UserInfoComponent
                    },
                    {
                        path: 'products',
                        component: UserProductsComponent
                    },
                ]
            }
        ]
    },
];
