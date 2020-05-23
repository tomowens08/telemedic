import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {BaseStorageService} from '../storage/baseStorage.service';

@Injectable()
export class TokenService extends BaseStorageService<string> {

  constructor(private  _storage: Storage) {
    super(_storage, 'keeno-token');
  }
}
