import { ColumnType, TableColumnIf } from "@/sharedComponents/dataTable";
import { InputIf } from "@/sharedComponents/formComponents/formInterfaces";
import DataTableWithModals from "@/sharedComponents/dataTableWithModals";
import {
    getTodoItems,
    addTodoItem,
    editTodoItem,
    deleteTodoItems,
} from "@/sharedComponents/lib/actions/todoList";
import { Fragment } from "react";
import PortfolioItemHeader from "@/components/portfolioItemHeader";

const itemFormInputs: InputIf[] = [
    {
        type: "text",
        label: "Name",
        name: "name",
        required: true,
    },
    {
        type: "checkbox",
        label: "Completed",
        name: "completed",
        required: false,
    },
];

const tableColumns: TableColumnIf[] = [
    {
        name: "id",
        label: "Id",
        type: ColumnType.TEXT,
    },
    {
        name: "name",
        label: "Name",
        type: ColumnType.TEXT,
    },
    {
        name: "completed",
        label: "Completed",
        type: ColumnType.BOOLEAN,
    },
];

const TodoList = ({
    label,
    pageDescription,
    github,
}: {
    label: string;
    pageDescription: string;
    github?: string;
}) => {
    return (
        <Fragment>
            <PortfolioItemHeader
                heading={label}
                description={pageDescription}
                githubLink={github}
            />
            <DataTableWithModals
                tableHeading={"To-Do List"}
                singularItemLabel={"To-Do Item"}
                pluralItemsLabel={"To-Do Items"}
                tableColumns={tableColumns}
                deleteSelectedItems={deleteTodoItems}
                addItem={addTodoItem}
                editItem={editTodoItem}
                itemFormInputs={itemFormInputs}
                getItems={getTodoItems}
            />
        </Fragment>
    );
};

export default TodoList;
