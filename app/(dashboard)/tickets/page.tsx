'use server';

import * as React from 'react';
import {PageContainer} from '@toolpad/core/PageContainer';
import CustomDataGrid from '../../components/CustomDataGrid';
import {columns, rows} from '../../mocks/gridOrdersData';

export default async function TicketPage() {
    const data = await fetch('https://api.vercel.app/blog')
    const posts = await data.json()
    console.log('Posts is %o', posts)
    return (
        <PageContainer>
            <CustomDataGrid rows={rows} columns={columns}/>
        </PageContainer>
    );
}
