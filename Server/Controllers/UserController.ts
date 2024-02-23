import { Request, Response } from 'express';
import UserModel, { User } from "../Models/UserModel.js";
import bcrypt from 'bcrypt';

// Getting a User
export const getUser = async (req: Request, res: Response): Promise<void> => {
    const id: string = req.params.id;

    try {
        const user: User | null = await UserModel.findById(id);

        if (user) {
            const { password, ...otherCredentials }: User = user;
            res.status(200).json(otherCredentials);
        } else {
            res.status(404).json("User Doesn't exist");
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

// Updating user's Information
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const id: string = req.params.id;
    const { currentUserId, currentUserAdminStatus, password }: { currentUserId: string, currentUserAdminStatus: boolean, password?: string } = req.body;

    try {
        if (id === currentUserId || currentUserAdminStatus) {
            if (password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt);
            }
            const user: User | null = await UserModel.findByIdAndUpdate(id, req.body, { new: true });

            res.status(200).json(user);
        } else {
            res.status(403).json("You are not allowed to update this Profile");
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

// Deleting a User
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const id: string = req.params.id;
    const { currentUserId, currentUserAdminStatus }: { currentUserId: string, currentUserAdminStatus: boolean } = req.body;

    try {
        if (currentUserId === id || currentUserAdminStatus) {
            await UserModel.findByIdAndDelete(id);
            res.status(200).json("Account deleted successfully");
        } else {
            res.status(403).json("You have no permission to delete this Account");
        }
    } catch (error) {
        res.status(500).json(error);
    }
};