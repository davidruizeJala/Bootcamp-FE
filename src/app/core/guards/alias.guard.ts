import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { ProfileStore } from '../services/profile-store';

export const aliasGuard: CanActivateFn = () => {
  const profile = inject(ProfileStore);
  const router = inject(Router);

  return profile.hasAlias() ? true : router.parseUrl('/perfil');
};
