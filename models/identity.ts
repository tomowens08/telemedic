export class Identity {
  id: number;
  name: string;
  tenantId: number;
  roles: string[] = [];
  isAuthenticated: boolean = false;
}
