/* eslint-disable @typescript-eslint/no-explicit-any */

export abstract class DTOController {
  abstract convertToDTO(model: any): any
}
