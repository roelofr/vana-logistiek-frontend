import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableCell from "@mui/material/TableCell";
import {Skeleton} from "@mui/material";

type Column = {
    title: string;
    width: number;
    shape?: 'round' | 'text'
}

type InputColumn = Column | Pick<Column, "title"> | string;

interface SkeletonProps {
    columns: InputColumn[];
    rows?: number;
}

const CHAR_WIDTH = 8;

function normalizeHeader(columns: InputColumn[]): Column[] {
    return columns.map(row => {
        if (typeof row === 'string')
            return {title: row, width: row.length * CHAR_WIDTH}

        if (Object.hasOwn(row, 'width'))
            return row;

        return {...row, width: row.title.length * CHAR_WIDTH}
    }) as Column[]
}

function columnToHeader(columns: Column[]) {
    return columns.map(column => {
        return {title: column.title, width: column.width ? `${column.width}px` : 'unset'}
    })
}

function columnToDataset(columns: Column[], count: number) {
    const baseRow = columns.map(row => row.width);

    return Array(count).fill(baseRow) as number[][];
}

export default function SkeletonTable({columns, rows = 25}: SkeletonProps) {
    const normColumns = normalizeHeader(columns);
    const headers = columnToHeader(normColumns);
    const rowset = columnToDataset(normColumns, rows);

    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 700}} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        {headers.map(({title, width}, index) => (
                            <TableCell key={index} sx={{width}}>{title}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rowset.map((row, index) => (
                        <TableRow key={index}>
                            {row.map((width, index) => (
                                <TableCell width={width} key={index}>
                                    <Skeleton width={width}/>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
