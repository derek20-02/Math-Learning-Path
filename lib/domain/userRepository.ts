import { dbConnect } from '../../db/connect';
import { UserModel } from '../../db/schema/user';
import { UserDomain } from './types';

export class UserRepository {
    static async findByEmail(email: string): Promise<UserDomain | null> {
        await dbConnect();
        const user = await UserModel.findOne({ email }).lean();
        if (!user) return null;
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
        };
    }
}