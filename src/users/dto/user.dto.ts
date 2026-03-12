export class UserDto {
  id: number | undefined;
  name: string | undefined;
  email: string | undefined;
  avatarUrl?: string;

  constructor(user: Partial<UserDto>) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.avatarUrl = user.avatarUrl;
  }
}
