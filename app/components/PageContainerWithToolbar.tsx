'use client';

import {Breadcrumb, PageHeader} from '@toolpad/core/PageContainer';
import {Container} from "@mui/material";
import Box from "@mui/material/Box";
import {PageHeaderToolbar} from "@toolpad/core";
import * as React from "react";

interface Props extends React.PropsWithChildren {
    title?: string;
    breadcrumbs?: Breadcrumb[];
    toolbar: React.ReactNode;
}

export default function PageContainerWithToolbar({title, breadcrumbs, toolbar, children}: Props) {
    const PageContainerWithToolbarToolbar = React.useCallback(() =>
        <PageHeaderToolbar>{toolbar}</PageHeaderToolbar>, [toolbar])

    return (
        <Container sx={{my: 2}}>
            <PageHeader breadcrumbs={breadcrumbs ?? undefined} title={title ?? undefined} slots={{toolbar: PageContainerWithToolbarToolbar}}/>
            <Box sx={{mt: 1}}>{children}</Box>
        </Container>
    )
}
