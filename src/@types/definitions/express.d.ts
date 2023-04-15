import { UserType } from '../../models/User';

declare global {
    namespace Express {
        export interface Request {
            user?: UserType | undefined;
        }
    }
}
