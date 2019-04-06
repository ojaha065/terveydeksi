import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'yritys-modal', loadChildren: './yritys-modal/yritys-modal.module#YritysModalPageModule' },  { path: 'ajanvaraus-modal', loadChildren: './ajanvaraus-modal/ajanvaraus-modal.module#AjanvarausModalPageModule' }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {};