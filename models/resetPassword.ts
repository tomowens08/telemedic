import {ResetPasswordInput} from '../providers/service-proxies/service-proxies';

export class ResetPassword extends ResetPasswordInput{
  passwordRepeat: string;
}
