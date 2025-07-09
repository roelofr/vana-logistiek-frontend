'use client';
import {DataSource, DataSourceCache} from '@toolpad/core/Crud';
import {z} from 'zod';
import {Vendor} from '../domain';
import {ApiStore} from "@/app/stores/apiStore";

const Urls = {
    List: (queryParams: URLSearchParams | null = null) => ApiStore.apiUrl('/vendors', queryParams),
    Create: () => ApiStore.apiUrl('/vendors'),
    Single: (id: number) => ApiStore.apiUrl(`/vendors/${id}`),
};

export const vendorDataSource: DataSource<Vendor> = {
    fields: [
        {field: 'id', headerName: 'ID'},
        {field: 'number', headerName: 'Nummer', width: 70},
        {field: 'name', headerName: 'Naam', flex: 1},
        {field: 'district', headerName: 'District', width: 200, type: 'singleSelect'},
    ],

    async getMany({paginationModel, filterModel, sortModel}) {
        const queryParams = new URLSearchParams();

        queryParams.append('page', paginationModel.page.toString());
        queryParams.append('pageSize', paginationModel.pageSize.toString());
        if (sortModel?.length) {
            queryParams.append('sort', JSON.stringify(sortModel));
        }
        if (filterModel?.items?.length) {
            queryParams.append('filter', JSON.stringify(filterModel.items));
        }

        const fetchUrl = Urls.List(queryParams)
        const res = await fetch(fetchUrl, {
            method: 'GET',
        });
        const resJson = await res.json();

        if (!res.ok) {
            throw new Error(resJson.error);
        }

        return resJson;
    },

    async getOne(employeeId) {
        const res = await fetch(Urls.Single(employeeId as number));
        const resJson = await res.json();

        if (!res.ok)
            throw new Error(resJson.error);

        return resJson;
    },
    async createOne(data) {
        const res = await fetch(Urls.Create(), {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'},
        });
        const resJson = await res.json();

        if (!res.ok)
            throw new Error(resJson.error);

        return resJson;
    },
    async updateOne(employeeId, data) {
        const res = await fetch(Urls.Single(employeeId as number), {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'},
        });
        const resJson = await res.json();

        if (!res.ok)
            throw new Error(resJson.error);

        return resJson;
    },
    async deleteOne(employeeId) {
        const res = await fetch(Urls.Single(employeeId as number), {method: 'DELETE'});
        const resJson = await res.json();

        if (!res.ok)
            throw new Error(resJson.error);

        return resJson;
    },
    validate: z.object({
        name: z.string({required_error: 'Name is required'}).nonempty('Name is required'),
        age: z.number({required_error: 'Age is required'}).min(18, 'Age must be at least 18'),
        joinDate: z
            .string({required_error: 'Join date is required'})
            .nonempty('Join date is required'),
        role: z.enum(['Market', 'Finance', 'Development'], {
            errorMap: () => ({message: 'Role must be "Market", "Finance" or "Development"'}),
        }),
    })['~standard'].validate,
};

export const vendorCache = new DataSourceCache();
