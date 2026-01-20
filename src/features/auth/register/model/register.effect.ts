import {authApi} from "../../../../shared/api/auth.api.ts";
import {useUserStore} from "../../../../entities/user/model/user.store.ts";
import type {RegisterDto} from "./register.dto.ts";

export async function registerEffect(dto: RegisterDto): Promise<void> {
  const { user, accessToken } = await authApi.register(dto);

  useUserStore.getState().setAuthData(user, accessToken);
}