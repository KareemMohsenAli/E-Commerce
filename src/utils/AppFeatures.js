import productModel from "../../DB/model/Product.js";


export class ApiFeatures {
  constructor(mongooseQuery, Query) {
    this.mongooseQuery = mongooseQuery;
    this.Query = Query;
  }
  pagination() {
    let pageNumber = this.Query.page * 1 || 1;
    if (this.Query.page <= 0) pageNumber = 1;
    const sizeForEachPage = 2;
    const skip = (pageNumber - 1) * sizeForEachPage;
    this.mongooseQuery.skip(skip).limit(sizeForEachPage);
    this.page=pageNumber
    return this;
  }
  filter(){
    let filterQuery={...this.Query}
    const exclude=['page','searchKey','sort','fields','keyword']
    exclude.forEach((element)=>{
      delete filterQuery[element]

    })
    filterQuery=JSON.stringify(filterQuery)
    filterQuery=filterQuery.replace(/\b(gt|gte|lt|lte)\b/g,match=>`$${match}`)
    filterQuery=JSON.parse(filterQuery)
    this.mongooseQuery.find(filterQuery)
    return this;
  }
  sort(){
    if(this.Query.sort){
        let sortedBy=this.Query.sort.split(',').join(' ')
        this.mongooseQuery.sort(sortedBy) 
      }
      return this
  }
  search(){
    if(this.Query.searchKey){
        this.mongooseQuery.find({$or:[{name:{$regex:this.Query.searchKey,$options:'i'}},{description:{$regex:this.Query.searchKey,$options:'i'}}]})
      }
      return this
  }
  selectedFields(){
    if(this.Query.fields){
        let fields=this.Query.fields.split(',').join(' ')
        this.mongooseQuery.select(fields) 
      }
      return this
  
  }
  async getCounts() {
    const countQuery = this.mongooseQuery.model.find(this.mongooseQuery._conditions);
    const totalDocuments = await countQuery.countDocuments();
    const totalPages = Math.ceil(totalDocuments / this.mongooseQuery.options.limit);
    return {
      totalDocuments, 
      totalPages,
    };
  }
  // async getCounts() {
  //   const aggregationPipeline = [
  //     // Match stage to apply the same filters as the main query
  //     {
  //       $match: this.mongooseQuery._conditions,
  //     },
  //     // Group stage to count the total documents
  //     {
  //       $group: {
  //         _id: null,
  //         totalDocuments: { $sum: 1 },
  //       },
  //     },
  //   ];
  
  //   const countResult = await this.mongooseQuery.model.aggregate(aggregationPipeline);
  
  //   const totalDocuments = countResult.length > 0 ? countResult[0].totalDocuments : 0;
  //   const totalPages = Math.ceil(totalDocuments / this.mongooseQuery.options.limit);
  
  //   return {
  //     totalDocuments,
  //     totalPages,
  //   };
  // }
  
}
