// import { type NextFunction, type Request, type Response } from 'express';
// import { body, param, query, validationResult } from 'express-validator';
//
// import {
//   COVER_OPERATOR,
//   INVOICE_MODE,
// } from '../../../config/constants/common.constants';
// import TokensService from '../../../service/tokens.service';
//
// const validate = (req: Request, res: Response, next: NextFunction): void => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     res.status(400).json({ errors: errors.array() });
//
//     return;
//   }
//
//   next();
// };
//
// export const createInvoiceValidator = [
//   body('recipient').isString(),
//   body('token')
//     .isString()
//     .custom(async (value) => {
//       const tokens = await TokensService.getActiveTokenIds();
//
//       if (
//         !tokens.find(
//           (token) => value.toLocaleLowerCase() === token.toLocaleLowerCase(),
//         )
//       ) {
//         return Promise.reject(
//           new Error(`TOKEN_UNSUPPORTED. Allowed Tokens - ${tokens.join(', ')}`),
//         );
//       }
//
//       return true;
//     }),
//   body('amount').isFloat(),
//   body('mode').optional({ values: 'null' }).default(INVOICE_MODE.default),
//   body('callback_url').optional({ values: 'null' }).isURL(),
//   body('metadata').optional({ values: 'null' }).isObject(),
//   body('description').optional({ values: 'null' }).isString(),
//   body('cover_percent').optional({ values: 'null' }).isNumeric(),
//   body('cover_amount').optional({ values: 'null' }).isFloat(),
//   body('cover_operator')
//     .optional({ values: 'null' })
//     .isString()
//     .isIn(Object.values(COVER_OPERATOR)),
//   validate,
// ];
//
// export const getInvoiceValidator = [param('invoiceId').isUUID(), validate];
//
// export const callbackURLInvoiceValidator = [
//   query('invoice_id').isUUID(),
//   validate,
// ];
