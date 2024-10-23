import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


function Pages({sortedProducts, productsPerPage, currentPage, setCurrentPage}) {


    return (

        <>
        <Stack sx={{p: 3, m:0}} spacing={2} mt={4} alignItems="center">
            <Pagination
              count={Math.ceil(sortedProducts.length / productsPerPage)}
              page={currentPage}
              onChange={(e, value) => setCurrentPage(value)} // Update the current page when the user selects a different page
              variant="outlined"
              shape="rounded"
              color="primary"
            />
          </Stack>
        
        </>
    )
}

export default Pages