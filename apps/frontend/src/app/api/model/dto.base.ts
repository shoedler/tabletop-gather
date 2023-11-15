export abstract class Dto {
  public readonly id!: string;

  public static fromJson<T extends Dto>(this: new () => T, json: any): T {
    return Object.assign(new this(), json);
  }
}
