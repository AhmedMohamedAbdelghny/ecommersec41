

class ApiFeatures {

    constructor(mongooseQuery, queryData) {
        this.mongooseQuery = mongooseQuery
        this.queryData = queryData
    }

    //pagination
    paginate() {
        let page = this.queryData.page * 1 || 1
        let limit = 3
        if (page < 0) page = 1
        let skip = (page - 1) * limit
        this.page = page
        this.mongooseQuery.find().skip(skip).limit(limit);
        return this
    }

    //filter
    filter() {
        let excludeQuery = ["page", "select", "sort", "search"]
        let filterQuery = { ...this.queryData }
        excludeQuery.forEach((e) => {
            delete filterQuery[e]
        })
        filterQuery = JSON.parse(JSON.stringify(filterQuery).replace(/(gt|gte|lt|lte)/, match => `$${match}`))
        this.mongooseQuery.find(filterQuery);
        return this

    }

    //sort
    sort() {
        if (this.queryData.sort) {
            this.queryData.sort = this.queryData.sort.replaceAll(",", " ")
        }
        this.mongooseQuery.sort(this.queryData.sort)
        return this
    }

    //select
    select() {
        if (this.queryData.select) {
            this.queryData.select = this.queryData.select.replaceAll(",", " ")
        }
        this.mongooseQuery.select(this.queryData.select)
        return this
    }

    //search
    search() {
        if (this.queryData.search) {
            this.mongooseQuery.find({
                $or: [
                    { title: { $regex: this.queryData.search, $options: "i" } },
                    { slug: { $regex: this.queryData.search, $options: "i" } }
                ]
            })
        }
        return this
    }
}

export default ApiFeatures