import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
 
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  },
 
  {
    path: 'preconnexion',
    loadChildren: () => import('./preconnexion/preconnexion.module').then( m => m.PreconnexionPageModule)
  },
  {
    path: 'authclient',
    loadChildren: () => import('./authclient/authclient.module').then( m => m.AuthclientPageModule)
  },
  {
    path: 'project-details/:id',
    loadChildren: () => import('./project-details/project-details.module').then( m => m.ProjectDetailsPageModule)
  },
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
