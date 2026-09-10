export class FreightOrderNotFoundError extends Error {
  constructor(id: string) {
    super(`Freight order ${id} was not found`);

    this.name = "FreightOrderNotFoundError";
  }
}
