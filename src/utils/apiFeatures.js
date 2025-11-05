//queryStr.keyword → client side la pass pannina keyword (ex: "phone")

//$regex: queryStr.keyword → name field la partial ah "phone" iruka nu check pannum. /mongo ndb oda query operator

//$options: "i" → "Phone", "PHONE" nu case differences ignore pannum.

//Regular Expression = oru string ku pattern set panna oru tool.
//Idhu use panni text la search, filter, validate panna mudiyum.

// 🔍 Search
const search = (query, queryStr) => {
  if (queryStr.keyword) {
    const keyword = {
      name: {
        $regex: queryStr.keyword,
        $options: "i", // case-insensitive search
      },
    };
    query = query.find({ ...keyword });
  }
  return query;
};

// 🎯 Filter
const filter = (query, queryStr) => {
  const queryCopy = { ...queryStr };

  // unwanted fields remove
  const removeFields = ["keyword", "page", "limit", "sort", "order"];
  removeFields.forEach((key) => delete queryCopy[key]);

  // advanced filter (gte, lte, gt, lt)
  let str = JSON.stringify(queryCopy);
  str = str.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

  query = query.find(JSON.parse(str));
  return query;
};

//e=equal to
//lt=lesser than
///gt=greater than


// 📑 Pagination
const paginate = (query, queryStr, resultPerPage) => {
  const currentPage = Number(queryStr.page) || 1;
  const skip = resultPerPage * (currentPage - 1);

  query = query.limit(resultPerPage).skip(skip);
  return query;
};


// ⚡ Sort
const sort = (query, queryStr) => {
  if (queryStr.sort) {
    const order = queryStr.order === "desc" ? -1 : 1;
    query = query.sort({ [queryStr.sort]: order });
  }
  return query;
};
//current page=3
//2*3-2
//2*2=4skip


module.exports={
    search,
    filter,
    paginate,
    sort
}