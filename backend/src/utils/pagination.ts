export const calculatePage = (totalCount: number, limit: number) => Math.ceil(totalCount / limit);

export const calculateOffset = (page: number, limit: number) => (page - 1) * limit;
