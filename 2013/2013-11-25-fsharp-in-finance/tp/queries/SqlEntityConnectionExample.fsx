#r "System.Data.Linq.dll"
#r "FSharp.Data.TypeProviders.dll"
#r "System.Data.dll"
#r "System.ComponentModel.DataAnnotations.dll"
#r "System.Data.Entity.dll"

#load "vizlib--show.fsx"

open System
open System.Data.Common
open System.ComponentModel.DataAnnotations
open System.Data.EntityClient
open System.Data.SqlClient
open System.Data.Sql
open System.Linq
open Microsoft.FSharp.Linq
open Microsoft.FSharp.Data.TypeProviders

type NorthwndDb = 
    SqlEntityConnection<ConnectionString = @"AttachDBFileName  = 'C:\projects\openfsharp\Scripts\northwnd.mdf';Server='.\SQLEXPRESS';User Instance=true;Integrated Security=SSPI",Pluralize=true>

let db = NorthwndDb.GetDataContext()

//-------------------- BASIC QUERIES --------------------------------------------

let customers = 
    query { for c in db.Customers do 
            select c }

customers |> showGrid



//-------------------- BASIC QUERIES (task) --------------------------------------------

// Adjust the query to return the contact names for the customers
//
// let customerContactNames = 
//     query { for c in db.Customers do 
//             select c }

customers |> showGrid

//-------------------- FILTERS etc. --------------------------------------------
//

let customersWithNamesStartingWithB = 
    query { for c in db.Customers do 
            where (c.ContactName.StartsWith "B") }
     |> teeGrid


//-------------------- FILTERS (task) --------------------------------------------
//

// Get the first 5 (first name, last name) pairs of employees born after 1960 whose last name starts with 'S'

let oldEmployeesWithLastNameStartingWithS =
    query { for emp in db.Employees do
            //where ... 
            //where ... 
            //select ... 
            //take 5 
           }
    |> teeGrid

//-------------------- AGGREGATIONS etc. --------------------------------------------
// Note: C# uses '.Distinct()'
//

let distinctCompanyNames = 
    query { for c in db.Customers do 
            select c.CompanyName
            distinct } 
    |> teeGrid

let customersAverageOrders = 
    query { for c in db.Customers do 
            averageBy (float c.Orders.Count) }
    |> teeGrid


//-------------------- AGGREGATIONS (task) --------------------------------------------
// TASK: Get the sum of all orders for all customers
//
// You may need to use 'float' to convert an integer to a double.

let sumOfAllOrdersForCustomers = 
    query { for c in db.Customers do 
            sumBy ... 
          }
    |> teeGrid


//-------------------- FURTHER EXAMPLE QUERIES --------------------------------------------


let employeesWithEmployees1 = 
    query { for c in db.Employees do 
            for x in c.Employees1 do 
            select (c.FirstName,c.LastName,x.City) }
    |> teeGrid

let managersWithEmployeesInLondon1 = 
    query { for c in db.Employees do 
            where (query { for x in c.Employees1 do exists (x.City = "London") })
            select c }
    |> teeGrid

let managersWithEmployeesInLondon2 = 
    query { for c in db.Employees do 
            where (c.Employees1.Any (fun x -> x.City = "London"))
            select c }
    |> teeGrid


let customerWithNamesStartingWithB = 
    query { for c in db.Customers do 
            where (c.CompanyName.StartsWith "A")
            select c }
    |> teeGrid


let customerNames = 
    query { for c in db.Customers do 
            select c.ContactName }
    |> teeGrid


let customersSortedByCountry = 
    query { for c in db.Customers do 
            sortBy c.Country
            select (c.Country, c.ContactName) }
    |> teeGrid

let res =
    query { for emp in db.Employees do
            where (emp.BirthDate.Value.Year > 1960)
            where (emp.LastName.StartsWith "S")
            select (emp.FirstName, emp.LastName) 
            take 5 }
    |> teeGrid

let joinCustomersAndEmployeesByName = 
    query { for c in db.Customers do 
            join e in db.Employees on (c.Country = e.Country)
            select (c.ContactName, e.LastName) }  
    |> teeGrid


let customersSortedDescending = 
    query { for c in db.Customers do 
            sortByDescending c.Country
            select (c.Country, c.CompanyName) }
    |> teeGrid

let customersSortedTwoColumns = 
    query { for c in db.Customers do 
            sortBy c.Country; thenBy c.Region
            select (c.Country, c.Region, c.CompanyName) }
    |> teeGrid

let customersSortedTwoColumnsAscendingDescending = 
    query { for c in db.Customers do 
            sortBy c.Country; thenByDescending c.Region
            select (c.Country, c.Region, c.CompanyName) }
    |> teeGrid


let sumOfAllOrdersForCustomers = 
    query { for c in db.Customers do 
            sumBy (float c.Orders.Count) }
    |> teeGrid

let customersSortedTwoColumnsDescendingAscending = 
    query { for c in db.Customers do 
            sortByDescending c.Country; thenBy c.Region
            select (c.Country, c.Region, c.CompanyName) }
    |> teeGrid

let customerSpecificsSorted = 
    query { for c in db.Customers do 
            sortBy c.Country
            select (c.Country, c.Region, c.CompanyName) }
    |> teeGrid

let customerSpecificsSortedTwoColumns = 
    query { for c in db.Customers do 
            sortBy c.Country
            thenBy c.Region
            select (c.Country, c.Region, c.CompanyName) }
    |> teeGrid


let customerLongestNameLength = 
    query { for c in db.Customers do 
            maxBy c.ContactName.Length } 
    |> teeGrid


let sumOfLengthsOfCustomerNames = 
    query { for c in db.Customers do 
              sumBy c.ContactName.Length }
    |> teeGrid

let customersAtSpecificAddress = 
    query { for c in db.Customers do 
            where (c.Address.Contains("Jardim das rosas"))
            select c }
    |> teeGrid

let customersAtSpecificAddressUsingIf = 
    query { for c in db.Customers do 
            if (c.Address.Contains("Jardim das rosas")) then
              select c }
    |> teeGrid

let productsGroupedByName = 
    query { for p in db.Products do
            groupBy p.ProductName  }
    |> Seq.map (fun g -> g.Key, seq { for p in g -> p.ProductName })
    |> teeGrid

let productsGroupedByName2 = 
    query { for p in db.Products do
            groupValBy p p.ProductName  }
    |> Seq.map (fun g -> g.Key, seq { for p in g -> p.ProductName })
    |> teeGrid

let countOfAllUnitsInStockForAllProducts = 
    query { for p in db.Products do
            sumBy  (int p.UnitsInStock.Value) }
    |> teeGrid


let sumByUsingValue = 
    // .Net SqlClient Data Provider: Warning: Null value is eliminated by an aggregate or other SET operation..
    query { for p in db.Employees do
            // This corresponds to SQL semantics if you assume SQL warnings are treated as errors
            sumBy p.ReportsTo.Value }
        |> teeGrid

let sumByNullableExample = 
    query { for p in db.Employees do
            sumByNullable p.ReportsTo }
        |> teeGrid


let namesAndIdsOfProductsGroupedByName = 
    query { for p in db.Products do
            groupBy p.Category.CategoryName into group
            for p in group do
              select (group.Key, p.ProductName) }
    |> teeGrid

let averagePriceOverProductRange =
    query { for p in db.Products do
            averageByNullable p.UnitPrice }
    |> teeGrid


let totalOrderQuantity =
    query { for c in db.Customers do 
            let numOrders = 
                query { for o in c.Orders do 
                        for od in o.Order_Details do 
                        sumByNullable (Nullable(int od.Quantity)) }
            let averagePrice = 
                query { for o in c.Orders do 
                        for od in o.Order_Details do 
                        averageByNullable (Nullable(od.UnitPrice)) }
            select (c.ContactName, numOrders, averagePrice) }
    |> teeGrid

let productsGroupedByNameAndCountedTest1 =
    query { for p in db.Products do
            groupBy p.Category.CategoryName into group
            let sum = 
               query { for p in group do
                        sumBy (int p.UnitsInStock.Value) }
            select (group.Key, sum) }
    |> teeGrid

let sumOfUnitsInStock = 
    query { for p in db.Products do
              sumBy (int p.UnitsInStock.Value) }
        |> teeGrid

let namesAndIdsOfProductsGroupdByID = 
    query { for p in db.Products do
            groupBy p.CategoryID into group
            for p in group do
            select (group.Key, p.ProductName, p.ProductID) }
    |> teeGrid

let minUnitPriceOfProductsGroupedByName = 
    query { for p in db.Products do
            groupBy p.Category into group
            let minOfGroup = 
                query { for p in group do 
                          minByNullable p.UnitPrice }
            select (group.Key.CategoryName, minOfGroup) }
    |> teeGrid

let crossJoinOfCustomersAndEmployees = 
    query { for c in db.Customers do 
            for e in db.Employees do 
            select (c.CompanyName, e.LastName) }
    |> teeGrid


let innerJoinQuery = 
    query { for c in db.Categories do
            join p in db.Products on (c.CategoryID =? p.CategoryID) 
            select (p.ProductName, c.CategoryName) } //produces flat sequence
    |> teeGrid

let joinCustomersAndEmployeesByNameUsingLoopAndConstraint = 
    query { for c in db.Customers do 
            for e in db.Employees do 
            where (c.Country = e.Country)
            select (c.ContactName + " " + e.LastName) }  
    |> teeGrid

let innerJoinQueryUsingLoopAndConstraint = 
    query { for c in db.Categories do
            for p in db.Products do
            where (c.CategoryID =? p.CategoryID)
            select (p.ProductName, c.CategoryName) } //produces flat sequence
    |> teeGrid

let innerGroupJoinQuery =
    query { for c in db.Categories do
            groupJoin p in db.Products on (c.CategoryID =? p.CategoryID) into prodGroup
            select (c.CategoryName, prodGroup) }
    |> teeGrid


let innerGroupJoinQueryWithAggregation =
    query { for c in db.Categories do
            groupJoin p in db.Products on (c.CategoryID =? p.CategoryID) into prodGroup
            let groupMax = query { for p in prodGroup do maxByNullable p.UnitsOnOrder }
            select (c.CategoryName, groupMax) }
    |> teeGrid

let innerGroupJoinQueryWithFollowingLoop =
    query { for c in db.Categories do
            groupJoin p in db.Products on (c.CategoryID =? p.CategoryID) into prodGroup
            for prod2 in prodGroup do 
            where (prod2.UnitPrice ?> 2.50M)
            select (c.CategoryName, prod2) }    
    |> teeGrid

let leftOuterJoinQuery =
    query { for c in db.Categories do
              groupJoin p in db.Products on (c.CategoryID =? p.CategoryID) into prodGroup
              let prodGroup = System.Linq.Enumerable.DefaultIfEmpty prodGroup
              for item in prodGroup do
                  select (c.CategoryName, (match item with null -> "" | _ -> item.ProductName)) }
    |> teeGrid

let checkForLongCustomerNameLength = 
    query { for c in db.Customers do 
            exists (c.Address.Length > 10) }
    |> teeGrid

let checkCustomerNameLengthsAreNotAllShort = 
    query { for c in db.Customers do 
            all (c.Address.Length < 10) }
    |> teeGrid

let queryWithOrderByInStrangePosition = 
    query { for c in db.Customers do
            sortBy c.City
            where (c.Country = "UK")
            select c.CompanyName }
    |> teeGrid

let queryWithNestedQueryInLetBeforeFinalSelect = 
    query { for c in db.Customers do
            let orders = query { for o in db.Orders do where (o.CustomerID = c.CustomerID); select o }
            select (c.ContactName,orders) }
    |> teeGrid

let queryWithExplicitNestedEnumerableQueryInLetBeforeFinalSelect = 
    query { for c in db.Customers do
            let orders = query { for o in 0 .. 100 do select (o+1) }
            select (c.ContactName,orders) }
    |> teeGrid

let queryWithImplicitNestedEnumerableQueryInLetBeforeFinalSelect = 
    query { for c in db.Customers do
            let orders = query { for o in 0 .. 100 do select (o+1) }
            select (c.ContactName,orders) }
    |> teeGrid

let queryWithNestedQueryInFinalSelect = 
    query { for c in db.Customers do
            select (c.ContactName, query { for o in db.Orders do where (o.CustomerID = c.CustomerID); select o }) }
    |> teeGrid

// The following example demonstrates how to use a composite key to join data from three tables:
let compositeKeyQuery = 
    query { for o in db.Orders do
            for p in db.Products do
            groupJoin d in db.Order_Details on ((o.OrderID, p.ProductID) = (d.OrderID, d.ProductID)) into details
            for d in details do
            select (o.OrderID, p.ProductID, d.UnitPrice) }
    |> teeGrid

