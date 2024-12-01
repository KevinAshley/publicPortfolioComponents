"use server";

import { PrismaClient, TodoItem } from "@prisma/client";
import { FormValuesIf } from "@/sharedComponents/formComponents/formInterfaces";
import { getAuthUser } from "@/sharedComponents/lib/actions/auth";

const prisma = new PrismaClient();

export async function getTodoItems() {
    try {
        const user = await getAuthUser();
        const todoItems = await prisma.todoItem.findMany({
            select: {
                id: true,
                name: true,
                completed: true,
                createdAt: true,
                updatedAt: true,
            },
            where: {
                userId: user.id,
            },
        });
        return {
            success: true,
            items: todoItems,
        };
    } catch (error: any) {
        return {
            success: false,
            errorMessage: error.message,
        };
    }
}

export async function addTodoItem(data: FormValuesIf) {
    try {
        const user = await getAuthUser();
        const { name, completed } = data as TodoItem;
        await prisma.todoItem.create({
            data: {
                name,
                completed,
                userId: user.id,
            },
        });
        return {
            success: true,
        };
    } catch (error: any) {
        return {
            success: false,
            errorMessage: error.message,
        };
    }
}

export async function editTodoItem({
    id,
    changedValues,
}: {
    id: number;
    changedValues: FormValuesIf;
}) {
    try {
        const user = await getAuthUser();
        const updatedItem = await prisma.todoItem.update({
            where: {
                id,
                userId: user.id,
            },
            data: changedValues,
        });
        if (!updatedItem) {
            throw new Error("Failed to update Todo Item");
        }
        return {
            success: true,
        };
    } catch (error: any) {
        return {
            success: false,
            errorMessage: error.message,
        };
    }
}

export async function deleteTodoItems(selectedIds: number[]) {
    try {
        const user = await getAuthUser();
        const deletedItems = await prisma.todoItem.deleteMany({
            where: {
                id: {
                    in: selectedIds,
                },
                userId: user.id,
            },
        });
        if (!deletedItems) {
            throw new Error("Failed to delete Todo Items");
        }
        return {
            success: true,
        };
    } catch (error: any) {
        return {
            success: false,
            errorMessage: error.message,
        };
    }
}
