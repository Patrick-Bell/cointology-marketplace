import { 
    Box, 
    Typography, 
    Checkbox, 
    Divider, 
    FormControlLabel, 
    FormControl, 
    Tooltip, 
    Radio, 
    RadioGroup 
  } from "@mui/material";
  import ScrollInView from "../animation/ScrollInView";
  import InfoIcon from '@mui/icons-material/Info';
  
  function FilterProduct({
    categories,
    tags,
    colors,
    ratings,
    selectedCategories,
    setSelectedCategories,
    selectedTags,
    setSelectedTags,
    selectedColors,
    setSelectedColors,
    selectedRatings,
    setSelectedRatings,
    sortOption,
    setSortOption,
    setCurrentPage
  }) {
    const handleColorChange = (e) => {
      const color = e.target.value;
      setSelectedColors((prev) => 
        prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
      );
      setCurrentPage(1);
    };
  
    const handleCategoryChange = (e) => {
      const category = e.target.value;
      setSelectedCategories((prev) =>
        prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
      );
      setCurrentPage(1);
    };
  
    const handleRatingChange = (e) => {
      const rating = Number(e.target.value);
      setSelectedRatings((prev) =>
        prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
      );
      setCurrentPage(1);
    };
  
    const handleTagChange = (e) => {
      const tag = e.target.value;
      setSelectedTags((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
      );
      setCurrentPage(1);
    };
  
    const handleSortChange = (e) => {
      setSortOption(e.target.value);
      setCurrentPage(1);
    };
  
    return (
      <>
        
        <ScrollInView direction='left'>
          <Divider />
  
          {/* Categories Section */}
          <Typography variant="subtitle1" gutterBottom>
            <strong>Categories</strong>
          </Typography>
          {categories.map((category) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  value={category}
                  onChange={handleCategoryChange}
                  checked={selectedCategories.includes(category)}
                />
              }
              label={category}
              // margin bottom for spacing
            />
          ))}
          <Divider />
  
          {/* Tags Section */}
          <Typography variant="subtitle1" gutterBottom>
            <strong>Tags</strong>
          </Typography>
          {tags.map((tag) => (
            <FormControlLabel
              key={tag}
              control={
                <Checkbox
                  value={tag}
                  onChange={handleTagChange}
                  checked={selectedTags.includes(tag)}
                  sx={{
                    '&.Mui-checked': {
                      color: 'secondary.main',
                    },
                  }}
                />
              }
              label={tag}
               // margin bottom for spacing
            />
          ))}
          <Divider />
  
          {/* Ratings Section */}
          <Typography sx={{ display: 'flex', alignItems: 'center' }} variant="subtitle1" gutterBottom>
            <strong>Ratings</strong>
            <Tooltip title='Ratings are rounded up' placement='right'>
              <InfoIcon fontSize='small' sx={{ ml: 1 }} />
            </Tooltip>
          </Typography>
          {ratings.map((rating) => (
            <FormControlLabel
              key={rating}
              control={
                <Checkbox
                  value={rating}
                  onChange={handleRatingChange}
                  checked={selectedRatings.includes(rating)}
                  sx={{
                    '&.Mui-checked': {
                      color: 'secondary.main',
                    },
                  }}
                />
              }
              label={rating}
              // margin bottom for spacing
            />
          ))}
          <Divider />
  
          {/* Colors Section */}
          <Typography variant="subtitle1" gutterBottom>
            <strong>Colors</strong>
          </Typography>
          {colors.map((color) => (
            <FormControlLabel
              key={color}
              control={
                <Checkbox
                  value={color}
                  onChange={handleColorChange}
                  checked={selectedColors.includes(color)}
                  sx={{
                    '&.Mui-checked': {
                      color: 'secondary.main',
                    },
                  }}
                />
              }
              label={color}
              // margin bottom for spacing
            />
          ))}
          <Divider  />
  
          {/* Sort Options Section */}
          <Typography variant="subtitle1" gutterBottom>
            <strong>Sort By</strong>
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="sort-options"
              value={sortOption}
              onChange={handleSortChange}
              row // Use row for horizontal layout
            >
              <FormControlLabel value="price-asc" control={<Radio />} label="Price: Low to High" />
              <FormControlLabel value="price-desc" control={<Radio />} label="Price: High to Low" />
              <FormControlLabel value="name-asc" control={<Radio />} label="Name: A to Z" />
              <FormControlLabel value="name-desc" control={<Radio />} label="Name: Z to A" />
            </RadioGroup>
          </FormControl>
        </ScrollInView>
      </>
    );
  }
  
  export default FilterProduct;
  