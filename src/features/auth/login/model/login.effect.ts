import type { LoginDto } from './login.dto';
import {authApi} from "../../../../shared/api/auth.api.ts";
import {useUserStore} from "../../../../entities/user/model/user.store.ts";

export async function loginEffect(dto: LoginDto): Promise<void> {
  const { user, accessToken } = await authApi.login(dto);

  useUserStore.getState().setAuthData(user, accessToken);
}