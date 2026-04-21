---
name: gin 
description: use this skill when you need to build a web server using gin. 
user-invocable: false
---

# Gin Web Framework

Gin is a high-performance HTTP web framework written in Go (Golang). It provides a Martini-like API with performance up to 40 times faster, thanks to its custom httprouter implementation featuring a zero-allocation router. Gin is designed for building REST APIs, web applications, and microservices where speed and developer productivity are essential. Key features include middleware support, crash-free operation with built-in recovery, JSON validation, route grouping, centralized error management, and built-in rendering for JSON, XML, HTML templates, and more.

The framework uses a context-based architecture where each HTTP request creates a `gin.Context` that flows through middleware and handlers, allowing data sharing and flow control. Gin supports automatic request binding and validation using struct tags, making it easy to parse JSON, XML, form data, and query parameters. The middleware system enables powerful extensibility for authentication, logging, CORS, rate limiting, and custom processing logic.

## Creating a Gin Router

The `gin.Default()` function creates a new Gin engine instance with Logger and Recovery middleware pre-attached. For a blank engine without middleware, use `gin.New()`. The engine serves as the central router and configuration hub for your application.

```go
package main

import (
    "log"
    "net/http"

    "github.com/gin-gonic/gin"
)

func main() {
    // Create router with default middleware (Logger and Recovery)
    router := gin.Default()

    // Or create a blank router without middleware
    // router := gin.New()

    // Define a simple endpoint
    router.GET("/ping", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "message": "pong",
        })
    })

    // Start server on port 8080
    if err := router.Run(":8080"); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}

// Test with: curl http://localhost:8080/ping
// Output: {"message":"pong"}
```

## HTTP Method Routing

Gin provides shortcut methods for all standard HTTP methods including GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS. The `Any()` method registers a route for all methods, while `Match()` allows specifying a subset of methods.

```go
package main

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

func main() {
    router := gin.Default()

    // GET request
    router.GET("/users", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"action": "list users"})
    })

    // POST request
    router.POST("/users", func(c *gin.Context) {
        c.JSON(http.StatusCreated, gin.H{"action": "create user"})
    })

    // PUT request
    router.PUT("/users/:id", func(c *gin.Context) {
        id := c.Param("id")
        c.JSON(http.StatusOK, gin.H{"action": "update user", "id": id})
    })

    // DELETE request
    router.DELETE("/users/:id", func(c *gin.Context) {
        id := c.Param("id")
        c.JSON(http.StatusOK, gin.H{"action": "delete user", "id": id})
    })

    // PATCH request
    router.PATCH("/users/:id", func(c *gin.Context) {
        id := c.Param("id")
        c.JSON(http.StatusOK, gin.H{"action": "patch user", "id": id})
    })

    // Handle all HTTP methods
    router.Any("/all-methods", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"method": c.Request.Method})
    })

    // Handle specific methods
    router.Match([]string{"GET", "POST"}, "/match", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"method": c.Request.Method})
    })

    router.Run(":8080")
}

// Test: curl -X POST http://localhost:8080/users
// Output: {"action":"create user"}
```

## URL Path Parameters

Gin supports dynamic URL parameters using `:param` syntax for single-segment matching and `*param` for wildcard matching that captures everything including slashes. Parameters are accessed via `c.Param()`.

```go
package main

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

func main() {
    router := gin.Default()

    // Single parameter - matches /user/john but not /user/ or /user
    router.GET("/user/:name", func(c *gin.Context) {
        name := c.Param("name")
        c.String(http.StatusOK, "Hello %s", name)
    })

    // Multiple parameters
    router.GET("/users/:userId/posts/:postId", func(c *gin.Context) {
        userId := c.Param("userId")
        postId := c.Param("postId")
        c.JSON(http.StatusOK, gin.H{
            "userId": userId,
            "postId": postId,
        })
    })

    // Wildcard parameter - matches /files/documents/report.pdf
    router.GET("/files/*filepath", func(c *gin.Context) {
        filepath := c.Param("filepath")
        c.JSON(http.StatusOK, gin.H{"filepath": filepath})
    })

    // Combined parameters
    router.GET("/user/:name/*action", func(c *gin.Context) {
        name := c.Param("name")
        action := c.Param("action")
        c.JSON(http.StatusOK, gin.H{
            "name":     name,
            "action":   action,
            "fullPath": c.FullPath(), // Returns "/user/:name/*action"
        })
    })

    router.Run(":8080")
}

// Test: curl http://localhost:8080/user/john
// Output: Hello john

// Test: curl http://localhost:8080/users/42/posts/100
// Output: {"postId":"100","userId":"42"}

// Test: curl http://localhost:8080/files/documents/report.pdf
// Output: {"filepath":"/documents/report.pdf"}
```

## Query String Parameters

Query parameters are accessed using `c.Query()`, `c.DefaultQuery()` for default values, and `c.GetQuery()` which returns a boolean indicating if the key exists. Array and map query parameters are also supported.

```go
package main

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

func main() {
    router := gin.Default()

    // Basic query parameters
    router.GET("/search", func(c *gin.Context) {
        // Get query parameter, returns empty string if not present
        query := c.Query("q")

        // Get with default value
        page := c.DefaultQuery("page", "1")
        limit := c.DefaultQuery("limit", "10")

        // Check if parameter exists
        sort, hasSort := c.GetQuery("sort")

        c.JSON(http.StatusOK, gin.H{
            "query":   query,
            "page":    page,
            "limit":   limit,
            "sort":    sort,
            "hasSort": hasSort,
        })
    })

    // Array query parameters: /tags?tag=go&tag=web&tag=api
    router.GET("/tags", func(c *gin.Context) {
        tags := c.QueryArray("tag")
        c.JSON(http.StatusOK, gin.H{"tags": tags})
    })

    // Map query parameters: /filters?ids[a]=1&ids[b]=2
    router.GET("/filters", func(c *gin.Context) {
        ids := c.QueryMap("ids")
        c.JSON(http.StatusOK, gin.H{"ids": ids})
    })

    router.Run(":8080")
}

// Test: curl "http://localhost:8080/search?q=golang&page=2&sort=date"
// Output: {"hasSort":true,"limit":"10","page":"2","query":"golang","sort":"date"}

// Test: curl "http://localhost:8080/tags?tag=go&tag=web&tag=api"
// Output: {"tags":["go","web","api"]}

// Test: curl "http://localhost:8080/filters?ids[a]=1&ids[b]=2"
// Output: {"ids":{"a":"1","b":"2"}}
```

## Form Data Handling

Gin provides methods for handling POST form data including `c.PostForm()`, `c.DefaultPostForm()`, and multipart form handling. Form data can come from `application/x-www-form-urlencoded` or `multipart/form-data` content types.

```go
package main

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

func main() {
    router := gin.Default()

    // Basic form handling
    router.POST("/login", func(c *gin.Context) {
        username := c.PostForm("username")
        password := c.PostForm("password")
        remember := c.DefaultPostForm("remember", "false")

        c.JSON(http.StatusOK, gin.H{
            "username": username,
            "password": "***",
            "remember": remember,
        })
    })

    // Combined query + form data
    router.POST("/submit", func(c *gin.Context) {
        // Query parameters
        id := c.Query("id")

        // Form data
        name := c.PostForm("name")
        message := c.PostForm("message")

        c.JSON(http.StatusOK, gin.H{
            "id":      id,
            "name":    name,
            "message": message,
        })
    })

    // Form arrays
    router.POST("/colors", func(c *gin.Context) {
        colors := c.PostFormArray("colors[]")
        c.JSON(http.StatusOK, gin.H{"colors": colors})
    })

    // Form maps: names[first]=John&names[last]=Doe
    router.POST("/names", func(c *gin.Context) {
        names := c.PostFormMap("names")
        c.JSON(http.StatusOK, gin.H{"names": names})
    })

    router.Run(":8080")
}

// Test: curl -X POST http://localhost:8080/login -d "username=admin&password=secret"
// Output: {"password":"***","remember":"false","username":"admin"}

// Test: curl -X POST "http://localhost:8080/submit?id=123" -d "name=John&message=Hello"
// Output: {"id":"123","message":"Hello","name":"John"}
```

## File Upload

Gin supports single and multiple file uploads through multipart form handling. Use `c.FormFile()` for single files and `c.MultipartForm()` for multiple files. The `SaveUploadedFile()` method saves files to disk.

```go
package main

import (
    "fmt"
    "log"
    "net/http"
    "path/filepath"

    "github.com/gin-gonic/gin"
)

func main() {
    router := gin.Default()

    // Set max multipart memory (default is 32 MiB)
    router.MaxMultipartMemory = 8 << 20 // 8 MiB

    // Single file upload
    router.POST("/upload", func(c *gin.Context) {
        file, err := c.FormFile("file")
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        // Save to uploads directory
        dst := filepath.Join("./uploads", file.Filename)
        if err := c.SaveUploadedFile(file, dst); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "filename": file.Filename,
            "size":     file.Size,
            "message":  fmt.Sprintf("'%s' uploaded!", file.Filename),
        })
    })

    // Multiple file upload
    router.POST("/upload-multiple", func(c *gin.Context) {
        form, err := c.MultipartForm()
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        files := form.File["files[]"]
        var uploaded []string

        for _, file := range files {
            dst := filepath.Join("./uploads", file.Filename)
            if err := c.SaveUploadedFile(file, dst); err != nil {
                log.Printf("Error saving %s: %v", file.Filename, err)
                continue
            }
            uploaded = append(uploaded, file.Filename)
        }

        c.JSON(http.StatusOK, gin.H{
            "uploaded": uploaded,
            "count":    len(uploaded),
        })
    })

    router.Run(":8080")
}

// Test single upload:
// curl -X POST http://localhost:8080/upload -F "file=@/path/to/file.pdf"

// Test multiple upload:
// curl -X POST http://localhost:8080/upload-multiple \
//   -F "files[]=@/path/to/file1.pdf" \
//   -F "files[]=@/path/to/file2.pdf"
```

## Route Groups

Route groups allow organizing routes with common prefixes and middleware. Groups can be nested and each group can have its own middleware that applies to all routes within it.

```go
package main

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

func main() {
    router := gin.Default()

    // API v1 group
    v1 := router.Group("/api/v1")
    {
        v1.GET("/users", func(c *gin.Context) {
            c.JSON(http.StatusOK, gin.H{"version": "v1", "users": []string{"Alice", "Bob"}})
        })
        v1.GET("/products", func(c *gin.Context) {
            c.JSON(http.StatusOK, gin.H{"version": "v1", "products": []string{"Widget"}})
        })
    }

    // API v2 group
    v2 := router.Group("/api/v2")
    {
        v2.GET("/users", func(c *gin.Context) {
            c.JSON(http.StatusOK, gin.H{"version": "v2", "users": []string{"Alice", "Bob", "Charlie"}})
        })
    }

    // Group with middleware
    authorized := router.Group("/admin")
    authorized.Use(authMiddleware())
    {
        authorized.GET("/dashboard", func(c *gin.Context) {
            user := c.MustGet("user").(string)
            c.JSON(http.StatusOK, gin.H{"dashboard": "admin", "user": user})
        })

        // Nested group
        settings := authorized.Group("/settings")
        {
            settings.GET("/profile", func(c *gin.Context) {
                c.JSON(http.StatusOK, gin.H{"section": "profile settings"})
            })
            settings.GET("/security", func(c *gin.Context) {
                c.JSON(http.StatusOK, gin.H{"section": "security settings"})
            })
        }
    }

    router.Run(":8080")
}

func authMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")
        if token != "Bearer secret-token" {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
            return
        }
        c.Set("user", "admin")
        c.Next()
    }
}

// Test: curl http://localhost:8080/api/v1/users
// Test: curl http://localhost:8080/admin/dashboard -H "Authorization: Bearer secret-token"
```

## JSON Request Binding

Gin's binding system automatically parses and validates JSON request bodies into Go structs. Use `c.ShouldBindJSON()` for non-aborting binding or `c.BindJSON()` which automatically returns 400 on error.

```go
package main

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

type CreateUserRequest struct {
    Name     string `json:"name" binding:"required,min=2,max=100"`
    Email    string `json:"email" binding:"required,email"`
    Age      int    `json:"age" binding:"required,gte=0,lte=150"`
    Password string `json:"password" binding:"required,min=8"`
}

type UpdateUserRequest struct {
    Name  string `json:"name" binding:"omitempty,min=2,max=100"`
    Email string `json:"email" binding:"omitempty,email"`
    Age   int    `json:"age" binding:"omitempty,gte=0,lte=150"`
}

func main() {
    router := gin.Default()

    // Create user with validation
    router.POST("/users", func(c *gin.Context) {
        var req CreateUserRequest

        // ShouldBindJSON returns error but doesn't abort
        if err := c.ShouldBindJSON(&req); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        c.JSON(http.StatusCreated, gin.H{
            "message": "User created",
            "user": gin.H{
                "name":  req.Name,
                "email": req.Email,
                "age":   req.Age,
            },
        })
    })

    // Update user with partial data
    router.PATCH("/users/:id", func(c *gin.Context) {
        var req UpdateUserRequest

        if err := c.ShouldBindJSON(&req); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "message": "User updated",
            "id":      c.Param("id"),
            "updates": req,
        })
    })

    router.Run(":8080")
}

// Test valid request:
// curl -X POST http://localhost:8080/users \
//   -H "Content-Type: application/json" \
//   -d '{"name":"John Doe","email":"john@example.com","age":30,"password":"secretpass"}'
// Output: {"message":"User created","user":{"age":30,"email":"john@example.com","name":"John Doe"}}

// Test invalid request:
// curl -X POST http://localhost:8080/users \
//   -H "Content-Type: application/json" \
//   -d '{"name":"J","email":"invalid"}'
// Output: {"error":"Key: 'CreateUserRequest.Name' Error:Field validation for 'Name' failed..."}
```

## Query and Form Binding

Gin can bind query parameters and form data to structs using the `form` tag. Use `c.ShouldBindQuery()` for query params, `c.ShouldBind()` for automatic detection, and struct tags support default values.

```go
package main

import (
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
)

type SearchParams struct {
    Query    string    `form:"q" binding:"required"`
    Page     int       `form:"page,default=1" binding:"min=1"`
    Limit    int       `form:"limit,default=10" binding:"min=1,max=100"`
    Sort     string    `form:"sort,default=created_at"`
    Order    string    `form:"order,default=desc" binding:"oneof=asc desc"`
    Tags     []string  `form:"tags"`
    After    time.Time `form:"after" time_format:"2006-01-02"`
}

type LoginForm struct {
    Username string `form:"username" binding:"required"`
    Password string `form:"password" binding:"required"`
    Remember bool   `form:"remember"`
}

func main() {
    router := gin.Default()

    // Bind query parameters
    router.GET("/search", func(c *gin.Context) {
        var params SearchParams

        if err := c.ShouldBindQuery(&params); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "query":  params.Query,
            "page":   params.Page,
            "limit":  params.Limit,
            "sort":   params.Sort,
            "order":  params.Order,
            "tags":   params.Tags,
            "after":  params.After,
        })
    })

    // Bind form data
    router.POST("/login", func(c *gin.Context) {
        var form LoginForm

        // ShouldBind automatically detects content type
        if err := c.ShouldBind(&form); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "username": form.Username,
            "remember": form.Remember,
            "message":  "Login successful",
        })
    })

    router.Run(":8080")
}

// Test query binding:
// curl "http://localhost:8080/search?q=golang&page=2&limit=20&tags=web&tags=api"
// Output: {"limit":20,"order":"desc","page":2,"query":"golang","sort":"created_at","tags":["web","api"]}

// Test form binding:
// curl -X POST http://localhost:8080/login -d "username=admin&password=secret&remember=true"
// Output: {"message":"Login successful","remember":true,"username":"admin"}
```

## URI Parameter Binding

Gin can bind URI path parameters directly to struct fields using the `uri` tag. This is useful for validating path parameters with the same validation rules as other bindings.

```go
package main

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

type UserURI struct {
    ID   string `uri:"id" binding:"required,uuid"`
    Name string `uri:"name" binding:"required,alphanum"`
}

type ResourceURI struct {
    Type string `uri:"type" binding:"required,oneof=posts comments likes"`
    ID   int    `uri:"id" binding:"required,min=1"`
}

func main() {
    router := gin.Default()

    // Bind and validate UUID in path
    router.GET("/users/:name/:id", func(c *gin.Context) {
        var uri UserURI

        if err := c.ShouldBindUri(&uri); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "name": uri.Name,
            "uuid": uri.ID,
        })
    })

    // Bind resource type and ID
    router.GET("/resources/:type/:id", func(c *gin.Context) {
        var uri ResourceURI

        if err := c.ShouldBindUri(&uri); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "type": uri.Type,
            "id":   uri.ID,
        })
    })

    router.Run(":8080")
}

// Test valid UUID:
// curl http://localhost:8080/users/john/550e8400-e29b-41d4-a716-446655440000
// Output: {"name":"john","uuid":"550e8400-e29b-41d4-a716-446655440000"}

// Test invalid UUID:
// curl http://localhost:8080/users/john/not-a-uuid
// Output: {"error":"Key: 'UserURI.ID' Error:Field validation for 'ID' failed on the 'uuid' tag"}

// Test resource binding:
// curl http://localhost:8080/resources/posts/42
// Output: {"id":42,"type":"posts"}
```

## Header Binding

Gin can bind HTTP headers to struct fields using the `header` tag. This is useful for extracting and validating common headers like API keys, content types, or custom headers.

```go
package main

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

type RequestHeaders struct {
    APIKey      string `header:"X-API-Key" binding:"required"`
    ContentType string `header:"Content-Type"`
    UserAgent   string `header:"User-Agent"`
    RequestID   string `header:"X-Request-ID"`
    RateLimit   int    `header:"X-Rate-Limit"`
}

func main() {
    router := gin.Default()

    router.POST("/api/data", func(c *gin.Context) {
        var headers RequestHeaders

        if err := c.ShouldBindHeader(&headers); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "api_key":      headers.APIKey,
            "content_type": headers.ContentType,
            "user_agent":   headers.UserAgent,
            "request_id":   headers.RequestID,
            "rate_limit":   headers.RateLimit,
        })
    })

    router.Run(":8080")
}

// Test:
// curl -X POST http://localhost:8080/api/data \
//   -H "X-API-Key: my-secret-key" \
//   -H "X-Request-ID: req-123" \
//   -H "X-Rate-Limit: 100" \
//   -H "Content-Type: application/json"
// Output: {"api_key":"my-secret-key","content_type":"application/json",...}
```

## JSON Response Rendering

Gin provides multiple JSON rendering methods: `c.JSON()` for standard JSON, `c.IndentedJSON()` for pretty-printed output, `c.PureJSON()` to avoid HTML escaping, and `c.SecureJSON()` to prevent JSON hijacking.

```go
package main

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

type User struct {
    ID       int      `json:"id"`
    Name     string   `json:"name"`
    Email    string   `json:"email"`
    Tags     []string `json:"tags"`
    IsActive bool     `json:"is_active"`
}

func main() {
    router := gin.Default()

    user := User{
        ID:       1,
        Name:     "John Doe",
        Email:    "john@example.com",
        Tags:     []string{"admin", "developer"},
        IsActive: true,
    }

    // Standard JSON
    router.GET("/json", func(c *gin.Context) {
        c.JSON(http.StatusOK, user)
    })

    // Pretty-printed JSON (for debugging)
    router.GET("/json/pretty", func(c *gin.Context) {
        c.IndentedJSON(http.StatusOK, user)
    })

    // Using gin.H (map shorthand)
    router.GET("/json/map", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "status":  "success",
            "message": "Data retrieved",
            "data":    user,
        })
    })

    // PureJSON - doesn't escape HTML characters
    router.GET("/json/pure", func(c *gin.Context) {
        c.PureJSON(http.StatusOK, gin.H{
            "html": "<b>Hello, world!</b>",
        })
    })

    // SecureJSON - prevents JSON hijacking (adds "while(1);" prefix for arrays)
    router.GET("/json/secure", func(c *gin.Context) {
        names := []string{"Alice", "Bob", "Charlie"}
        c.SecureJSON(http.StatusOK, names)
    })

    // JSONP for cross-domain requests
    router.GET("/jsonp", func(c *gin.Context) {
        c.JSONP(http.StatusOK, gin.H{"data": "jsonp response"})
    })

    // AsciiJSON - escapes non-ASCII characters
    router.GET("/json/ascii", func(c *gin.Context) {
        c.AsciiJSON(http.StatusOK, gin.H{"message": "Hello, "})
    })

    router.Run(":8080")
}

// Test JSON: curl http://localhost:8080/json
// Output: {"id":1,"name":"John Doe","email":"john@example.com","tags":["admin","developer"],"is_active":true}

// Test SecureJSON: curl http://localhost:8080/json/secure
// Output: while(1);["Alice","Bob","Charlie"]

// Test JSONP: curl "http://localhost:8080/jsonp?callback=myFunc"
// Output: myFunc({"data":"jsonp response"});
```

## XML, YAML, TOML, and ProtoBuf Rendering

Gin supports rendering responses in multiple formats including XML, YAML, TOML, and Protocol Buffers, making it easy to build APIs that support content negotiation.

```go
package main

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

type Product struct {
    ID    int     `json:"id" xml:"id" yaml:"id"`
    Name  string  `json:"name" xml:"name" yaml:"name"`
    Price float64 `json:"price" xml:"price" yaml:"price"`
}

func main() {
    router := gin.Default()

    product := Product{ID: 1, Name: "Widget", Price: 29.99}

    // JSON response
    router.GET("/product.json", func(c *gin.Context) {
        c.JSON(http.StatusOK, product)
    })

    // XML response
    router.GET("/product.xml", func(c *gin.Context) {
        c.XML(http.StatusOK, product)
    })

    // YAML response
    router.GET("/product.yaml", func(c *gin.Context) {
        c.YAML(http.StatusOK, product)
    })

    // TOML response
    router.GET("/product.toml", func(c *gin.Context) {
        c.TOML(http.StatusOK, gin.H{
            "id":    product.ID,
            "name":  product.Name,
            "price": product.Price,
        })
    })

    // Content negotiation based on Accept header
    router.GET("/product", func(c *gin.Context) {
        c.Negotiate(http.StatusOK, gin.Negotiate{
            Offered:  []string{gin.MIMEJSON, gin.MIMEXML, gin.MIMEYAML},
            Data:     product,
            JSONData: product,
            XMLData:  product,
            YAMLData: product,
        })
    })

    router.Run(":8080")
}

// Test XML: curl http://localhost:8080/product.xml
// Output: <Product><id>1</id><name>Widget</name><price>29.99</price></Product>

// Test YAML: curl http://localhost:8080/product.yaml
// Output: id: 1\nname: Widget\nprice: 29.99

// Test content negotiation:
// curl http://localhost:8080/product -H "Accept: application/xml"
```

## HTML Template Rendering

Gin supports HTML template rendering using Go's `html/template` package. Templates can be loaded from files using glob patterns, and custom template functions can be registered.

```go
package main

import (
    "html/template"
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
)

func formatDate(t time.Time) string {
    return t.Format("January 2, 2006")
}

func main() {
    router := gin.Default()

    // Register custom template functions before loading templates
    router.SetFuncMap(template.FuncMap{
        "formatDate": formatDate,
        "upper":      strings.ToUpper,
    })

    // Load templates from a directory
    router.LoadHTMLGlob("templates/*")
    // Or load specific files:
    // router.LoadHTMLFiles("templates/index.html", "templates/user.html")

    // Render HTML template
    router.GET("/", func(c *gin.Context) {
        c.HTML(http.StatusOK, "index.html", gin.H{
            "title":   "Home Page",
            "message": "Welcome to Gin!",
        })
    })

    // Template with data
    router.GET("/user/:name", func(c *gin.Context) {
        c.HTML(http.StatusOK, "user.html", gin.H{
            "title": "User Profile",
            "user": gin.H{
                "name":      c.Param("name"),
                "email":     "user@example.com",
                "createdAt": time.Now(),
            },
        })
    })

    // Custom delimiters (useful when templates conflict with frontend frameworks)
    router.Delims("{[{", "}]}")

    router.Run(":8080")
}

// templates/index.html:
// <!DOCTYPE html>
// <html>
// <head><title>{{.title}}</title></head>
// <body><h1>{{.message}}</h1></body>
// </html>

// templates/user.html:
// <!DOCTYPE html>
// <html>
// <head><title>{{.title}}</title></head>
// <body>
//   <h1>{{.user.name | upper}}</h1>
//   <p>Email: {{.user.email}}</p>
//   <p>Joined: {{.user.createdAt | formatDate}}</p>
// </body>
// </html>
```

## Static File Serving

Gin provides methods for serving static files and directories. Use `Static()` for directories, `StaticFile()` for single files, and `StaticFS()` for custom file systems.

```go
package main

import (
    "embed"
    "io/fs"
    "net/http"

    "github.com/gin-gonic/gin"
)

//go:embed assets/*
var embeddedAssets embed.FS

func main() {
    router := gin.Default()

    // Serve a directory of static files
    router.Static("/static", "./public")

    // Serve a single static file
    router.StaticFile("/favicon.ico", "./resources/favicon.ico")

    // Serve with custom file system (e.g., for embedded files)
    assetsFS, _ := fs.Sub(embeddedAssets, "assets")
    router.StaticFS("/assets", http.FS(assetsFS))

    // Serve files without directory listing
    router.StaticFS("/files", gin.Dir("./uploads", false))

    // Serve file as download attachment
    router.GET("/download/:filename", func(c *gin.Context) {
        filename := c.Param("filename")
        filepath := "./downloads/" + filename
        c.FileAttachment(filepath, filename)
    })

    // Serve file inline
    router.GET("/view/:filename", func(c *gin.Context) {
        filename := c.Param("filename")
        c.File("./documents/" + filename)
    })

    router.Run(":8080")
}

// Access: http://localhost:8080/static/css/style.css
// Access: http://localhost:8080/favicon.ico
// Download: http://localhost:8080/download/report.pdf
```

## Custom Middleware

Middleware in Gin are functions that process requests before/after the main handler. Use `c.Next()` to call subsequent handlers and `c.Abort()` to stop the chain. Middleware can set context values accessible to handlers.

```go
package main

import (
    "log"
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
)

// Logger middleware
func RequestLogger() gin.HandlerFunc {
    return func(c *gin.Context) {
        start := time.Now()
        path := c.Request.URL.Path

        // Process request
        c.Next()

        // Log after request
        latency := time.Since(start)
        status := c.Writer.Status()
        log.Printf("[%d] %s %s - %v", status, c.Request.Method, path, latency)
    }
}

// Authentication middleware
func AuthRequired() gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")

        if token == "" {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
                "error": "Authorization header required",
            })
            return
        }

        // Validate token (simplified)
        if token != "Bearer valid-token" {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
                "error": "Invalid token",
            })
            return
        }

        // Set user info in context
        c.Set("userID", "user-123")
        c.Set("role", "admin")

        c.Next()
    }
}

// Rate limiting middleware
func RateLimiter(maxRequests int) gin.HandlerFunc {
    // Simplified rate limiter
    requests := make(map[string]int)

    return func(c *gin.Context) {
        ip := c.ClientIP()
        requests[ip]++

        if requests[ip] > maxRequests {
            c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
                "error": "Rate limit exceeded",
            })
            return
        }

        c.Next()
    }
}

// Request ID middleware
func RequestID() gin.HandlerFunc {
    return func(c *gin.Context) {
        requestID := c.GetHeader("X-Request-ID")
        if requestID == "" {
            requestID = generateRequestID() // Your ID generator
        }

        c.Set("requestID", requestID)
        c.Header("X-Request-ID", requestID)

        c.Next()
    }
}

func main() {
    router := gin.New() // Blank router without default middleware

    // Global middleware
    router.Use(RequestLogger())
    router.Use(RequestID())

    // Public routes
    router.GET("/health", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"status": "healthy"})
    })

    // Protected routes with auth middleware
    api := router.Group("/api")
    api.Use(AuthRequired())
    {
        api.GET("/profile", func(c *gin.Context) {
            userID := c.GetString("userID")
            role := c.GetString("role")
            c.JSON(http.StatusOK, gin.H{
                "userID": userID,
                "role":   role,
            })
        })
    }

    router.Run(":8080")
}

func generateRequestID() string {
    return fmt.Sprintf("req-%d", time.Now().UnixNano())
}

// Test: curl http://localhost:8080/health
// Test: curl http://localhost:8080/api/profile -H "Authorization: Bearer valid-token"
```

## Basic Authentication Middleware

Gin provides built-in middleware for HTTP Basic Authentication. Use `gin.BasicAuth()` with a map of username/password pairs, or `gin.BasicAuthForRealm()` to specify a custom realm.

```go
package main

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

func main() {
    router := gin.Default()

    // Define authorized users
    authorized := router.Group("/admin", gin.BasicAuth(gin.Accounts{
        "admin":  "admin123",
        "editor": "editor456",
        "viewer": "viewer789",
    }))

    // Admin dashboard - accessible to all authenticated users
    authorized.GET("/dashboard", func(c *gin.Context) {
        // Get authenticated user
        user := c.MustGet(gin.AuthUserKey).(string)

        c.JSON(http.StatusOK, gin.H{
            "message": "Welcome to admin dashboard",
            "user":    user,
        })
    })

    // User management - check role
    authorized.GET("/users", func(c *gin.Context) {
        user := c.MustGet(gin.AuthUserKey).(string)

        if user != "admin" {
            c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "users": []string{"user1", "user2", "user3"},
        })
    })

    // Basic auth with custom realm
    customAuth := router.Group("/api", gin.BasicAuthForRealm(gin.Accounts{
        "api-user": "api-secret",
    }, "API Access"))

    customAuth.GET("/data", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"data": "protected data"})
    })

    router.Run(":8080")
}

// Test: curl http://localhost:8080/admin/dashboard -u admin:admin123
// Output: {"message":"Welcome to admin dashboard","user":"admin"}

// Test without auth: curl http://localhost:8080/admin/dashboard
// Returns: 401 Unauthorized with WWW-Authenticate header
```

## Recovery Middleware

The Recovery middleware catches panics in handlers and returns a 500 error instead of crashing the server. Use `gin.Recovery()` for default behavior or `gin.CustomRecovery()` to define custom panic handling.

```go
package main

import (
    "fmt"
    "log"
    "net/http"

    "github.com/gin-gonic/gin"
)

func main() {
    router := gin.New()

    // Use default recovery middleware
    router.Use(gin.Logger())
    router.Use(gin.Recovery())

    // Or use custom recovery with custom handler
    router.Use(gin.CustomRecovery(func(c *gin.Context, recovered any) {
        if err, ok := recovered.(string); ok {
            c.JSON(http.StatusInternalServerError, gin.H{
                "error":   "Internal server error",
                "message": err,
            })
        }
        c.AbortWithStatus(http.StatusInternalServerError)
    }))

    // Route that panics
    router.GET("/panic", func(c *gin.Context) {
        panic("Something went wrong!")
    })

    // Route that panics with error
    router.GET("/error", func(c *gin.Context) {
        var slice []int
        _ = slice[10] // Index out of range panic
    })

    // Safe route
    router.GET("/safe", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"message": "This route is safe"})
    })

    router.Run(":8080")
}

// Test: curl http://localhost:8080/panic
// Returns: 500 Internal Server Error (server keeps running)

// Test: curl http://localhost:8080/safe
// Returns: {"message":"This route is safe"}
```

## Logger Middleware Configuration

Gin's Logger middleware can be customized to change output format, skip certain paths, or use custom writers. Use `gin.LoggerWithConfig()` or `gin.LoggerWithFormatter()` for customization.

```go
package main

import (
    "fmt"
    "io"
    "net/http"
    "os"
    "time"

    "github.com/gin-gonic/gin"
)

func main() {
    // Disable console color for file logging
    gin.DisableConsoleColor()

    // Create log file
    f, _ := os.Create("gin.log")
    gin.DefaultWriter = io.MultiWriter(f, os.Stdout)

    router := gin.New()

    // Custom log format
    router.Use(gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
        return fmt.Sprintf("[%s] %s %s %d %s %s\n",
            param.TimeStamp.Format(time.RFC3339),
            param.ClientIP,
            param.Method,
            param.StatusCode,
            param.Latency,
            param.Path,
        )
    }))

    // Or use LoggerWithConfig for more options
    router.Use(gin.LoggerWithConfig(gin.LoggerConfig{
        // Skip logging for certain paths
        SkipPaths: []string{"/health", "/metrics"},

        // Skip based on custom logic
        Skip: func(c *gin.Context) bool {
            return c.Writer.Status() < 400 // Only log errors
        },

        // Don't log query strings (for security)
        SkipQueryString: true,
    }))

    router.Use(gin.Recovery())

    router.GET("/health", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"status": "healthy"})
    })

    router.GET("/api/data", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"data": "value"})
    })

    router.Run(":8080")
}

// Log output format:
// [2024-01-15T10:30:00Z] 127.0.0.1 GET 200 1.234ms /api/data
```

## Context Data and Flow Control

The `gin.Context` provides methods to store/retrieve data (`Set`/`Get`), control request flow (`Next`/`Abort`), and manage errors. Data set in middleware is accessible in subsequent handlers.

```go
package main

import (
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
)

func main() {
    router := gin.Default()

    // Middleware that sets context values
    router.Use(func(c *gin.Context) {
        c.Set("requestTime", time.Now())
        c.Set("userAgent", c.GetHeader("User-Agent"))
        c.Next()
    })

    router.GET("/context", func(c *gin.Context) {
        // Get values set by middleware
        requestTime := c.MustGet("requestTime").(time.Time)
        userAgent := c.GetString("userAgent")

        // Type-safe getters
        count := c.GetInt("count")           // Returns 0 if not set
        name := c.GetString("name")          // Returns "" if not set
        active := c.GetBool("active")        // Returns false if not set

        // Check if key exists
        value, exists := c.Get("someKey")

        c.JSON(http.StatusOK, gin.H{
            "requestTime": requestTime,
            "userAgent":   userAgent,
            "count":       count,
            "keyExists":   exists,
        })
    })

    // Demonstrate flow control
    router.GET("/flow", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"step": 1})
    }, func(c *gin.Context) {
        // This won't run because previous handler didn't call c.Next()
        c.JSON(http.StatusOK, gin.H{"step": 2})
    })

    // Abort example
    router.GET("/abort", func(c *gin.Context) {
        if c.Query("fail") == "true" {
            c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
                "error": "Request aborted",
            })
            return // Important: return after abort
        }
        c.Next()
    }, func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"message": "Success"})
    })

    router.Run(":8080")
}

// Test: curl http://localhost:8080/context
// Test: curl "http://localhost:8080/abort?fail=true"
```

## Error Handling

Gin provides structured error handling through `c.Error()` which collects errors during request processing. Errors can be categorized by type and processed by middleware or at the end of the handler chain.

```go
package main

import (
    "errors"
    "net/http"

    "github.com/gin-gonic/gin"
)

// Custom error types
var (
    ErrNotFound     = errors.New("resource not found")
    ErrUnauthorized = errors.New("unauthorized access")
    ErrValidation   = errors.New("validation failed")
)

// Error handling middleware
func ErrorHandler() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Next()

        // Check if there are any errors
        if len(c.Errors) > 0 {
            err := c.Errors.Last()

            // Determine status code based on error
            var status int
            switch {
            case errors.Is(err.Err, ErrNotFound):
                status = http.StatusNotFound
            case errors.Is(err.Err, ErrUnauthorized):
                status = http.StatusUnauthorized
            case errors.Is(err.Err, ErrValidation):
                status = http.StatusBadRequest
            default:
                status = http.StatusInternalServerError
            }

            c.JSON(status, gin.H{
                "error":   err.Error(),
                "type":    err.Type,
                "details": c.Errors.JSON(),
            })
        }
    }
}

func main() {
    router := gin.New()
    router.Use(gin.Logger())
    router.Use(gin.Recovery())
    router.Use(ErrorHandler())

    // Route with potential errors
    router.GET("/users/:id", func(c *gin.Context) {
        id := c.Param("id")

        if id == "0" {
            c.Error(ErrNotFound)
            return
        }

        if id == "unauthorized" {
            c.Error(ErrUnauthorized)
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "id":   id,
            "name": "User " + id,
        })
    })

    // Multiple errors
    router.POST("/validate", func(c *gin.Context) {
        // Collect multiple validation errors
        var hasErrors bool

        if c.Query("name") == "" {
            c.Error(errors.New("name is required")).SetType(gin.ErrorTypePublic)
            hasErrors = true
        }

        if c.Query("email") == "" {
            c.Error(errors.New("email is required")).SetType(gin.ErrorTypePublic)
            hasErrors = true
        }

        if hasErrors {
            c.Error(ErrValidation)
            return
        }

        c.JSON(http.StatusOK, gin.H{"message": "Valid"})
    })

    router.Run(":8080")
}

// Test: curl http://localhost:8080/users/0
// Output: {"error":"resource not found",...}

// Test: curl -X POST "http://localhost:8080/validate"
// Output: {"error":"validation failed","details":[...]}
```

## Cookie Management

Gin provides methods to set and retrieve cookies. Use `c.SetCookie()` for simple cookies or `c.SetCookieData()` with `http.Cookie` struct for full control over cookie attributes.

```go
package main

import (
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
)

func main() {
    router := gin.Default()

    // Set a simple cookie
    router.GET("/set-cookie", func(c *gin.Context) {
        // SetCookie(name, value, maxAge, path, domain, secure, httpOnly)
        c.SetCookie("user_id", "12345", 3600, "/", "localhost", false, true)
        c.JSON(http.StatusOK, gin.H{"message": "Cookie set"})
    })

    // Set cookie with more options using http.Cookie
    router.GET("/set-cookie-advanced", func(c *gin.Context) {
        c.SetSameSite(http.SameSiteStrictMode)
        c.SetCookieData(&http.Cookie{
            Name:     "session",
            Value:    "abc123xyz",
            Path:     "/",
            Domain:   "localhost",
            MaxAge:   86400, // 24 hours
            Secure:   true,
            HttpOnly: true,
            SameSite: http.SameSiteStrictMode,
            Expires:  time.Now().Add(24 * time.Hour),
        })
        c.JSON(http.StatusOK, gin.H{"message": "Advanced cookie set"})
    })

    // Read a cookie
    router.GET("/get-cookie", func(c *gin.Context) {
        userId, err := c.Cookie("user_id")
        if err != nil {
            c.JSON(http.StatusNotFound, gin.H{"error": "Cookie not found"})
            return
        }
        c.JSON(http.StatusOK, gin.H{"user_id": userId})
    })

    // Delete a cookie (set MaxAge to -1)
    router.GET("/delete-cookie", func(c *gin.Context) {
        c.SetCookie("user_id", "", -1, "/", "localhost", false, true)
        c.JSON(http.StatusOK, gin.H{"message": "Cookie deleted"})
    })

    router.Run(":8080")
}

// Test set: curl -c cookies.txt http://localhost:8080/set-cookie
// Test get: curl -b cookies.txt http://localhost:8080/get-cookie
```

## HTTP Redirects

Gin supports both external URL redirects and internal route redirects. Use `c.Redirect()` for standard redirects or modify the request path and call `HandleContext()` for internal redirects.

```go
package main

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

func main() {
    router := gin.Default()

    // External redirect (301 Permanent)
    router.GET("/google", func(c *gin.Context) {
        c.Redirect(http.StatusMovedPermanently, "https://www.google.com")
    })

    // Temporary redirect (302)
    router.GET("/temp-redirect", func(c *gin.Context) {
        c.Redirect(http.StatusFound, "/new-location")
    })

    // Redirect from POST (303 See Other)
    router.POST("/submit", func(c *gin.Context) {
        // Process form...
        c.Redirect(http.StatusSeeOther, "/success")
    })

    // Internal route redirect
    router.GET("/old-path", func(c *gin.Context) {
        c.Request.URL.Path = "/new-path"
        router.HandleContext(c)
    })

    router.GET("/new-path", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"message": "You've been redirected internally"})
    })

    router.GET("/new-location", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"message": "Temporary redirect destination"})
    })

    router.GET("/success", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"message": "Form submitted successfully"})
    })

    router.Run(":8080")
}

// Test: curl -L http://localhost:8080/temp-redirect
// Test: curl -X POST -L http://localhost:8080/submit
```

## Server-Sent Events (SSE)

Gin supports Server-Sent Events for real-time server-to-client communication. Use `c.SSEvent()` to send events and `c.Stream()` for continuous streaming.

```go
package main

import (
    "fmt"
    "io"
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
)

func main() {
    router := gin.Default()

    // SSE endpoint
    router.GET("/events", func(c *gin.Context) {
        c.Header("Content-Type", "text/event-stream")
        c.Header("Cache-Control", "no-cache")
        c.Header("Connection", "keep-alive")

        // Stream events
        c.Stream(func(w io.Writer) bool {
            // Send event
            c.SSEvent("message", gin.H{
                "time": time.Now().Format(time.RFC3339),
                "data": "Hello from server",
            })

            time.Sleep(1 * time.Second)
            return true // Keep connection open
        })
    })

    // SSE with different event types
    router.GET("/notifications", func(c *gin.Context) {
        c.Header("Content-Type", "text/event-stream")
        c.Header("Cache-Control", "no-cache")
        c.Header("Connection", "keep-alive")

        count := 0
        c.Stream(func(w io.Writer) bool {
            count++

            if count%3 == 0 {
                c.SSEvent("alert", gin.H{"level": "warning", "message": "Check system"})
            } else {
                c.SSEvent("update", gin.H{"count": count})
            }

            time.Sleep(2 * time.Second)
            return count < 10 // Close after 10 events
        })
    })

    router.Run(":8080")
}

// Test with curl: curl http://localhost:8080/events
// Or in browser with EventSource:
// const es = new EventSource('/events');
// es.onmessage = (e) => console.log(JSON.parse(e.data));
```

## Custom HTTP Server Configuration

Gin can be used with custom `http.Server` configurations for timeouts, TLS, HTTP/2, and graceful shutdown support.

```go
package main

import (
    "context"
    "log"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"

    "github.com/gin-gonic/gin"
)

func main() {
    router := gin.Default()

    router.GET("/", func(c *gin.Context) {
        time.Sleep(2 * time.Second) // Simulate slow request
        c.JSON(http.StatusOK, gin.H{"message": "Hello"})
    })

    // Custom server with timeouts
    srv := &http.Server{
        Addr:           ":8080",
        Handler:        router,
        ReadTimeout:    10 * time.Second,
        WriteTimeout:   10 * time.Second,
        MaxHeaderBytes: 1 << 20, // 1 MB
    }

    // Start server in goroutine
    go func() {
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatalf("Server error: %v", err)
        }
    }()

    // Wait for interrupt signal
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit
    log.Println("Shutting down server...")

    // Graceful shutdown with timeout
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    if err := srv.Shutdown(ctx); err != nil {
        log.Fatal("Server forced to shutdown:", err)
    }

    log.Println("Server exiting")
}

// For HTTPS/TLS:
// srv.ListenAndServeTLS("cert.pem", "key.pem")

// For HTTP/3 (QUIC):
// router.RunQUIC(":8080", "cert.pem", "key.pem")
```

## Trusted Proxies Configuration

When running behind a reverse proxy, configure trusted proxies to correctly resolve client IP addresses from headers like `X-Forwarded-For`.

```go
package main

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

func main() {
    router := gin.Default()

    // Trust specific proxy IPs
    router.SetTrustedProxies([]string{"192.168.1.1", "10.0.0.0/8"})

    // Or disable proxy trust entirely (direct connections only)
    // router.SetTrustedProxies(nil)

    // For CDN platforms, use TrustedPlatform
    // router.TrustedPlatform = gin.PlatformCloudflare  // Uses CF-Connecting-IP
    // router.TrustedPlatform = gin.PlatformGoogleAppEngine
    // router.TrustedPlatform = gin.PlatformFlyIO
    // router.TrustedPlatform = "X-Custom-Client-IP"  // Custom header

    router.GET("/ip", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "clientIP": c.ClientIP(),
            "remoteIP": c.RemoteIP(),
        })
    })

    router.Run(":8080")
}

// Behind nginx with X-Forwarded-For:
// curl http://localhost:8080/ip
// Output: {"clientIP":"real-client-ip","remoteIP":"proxy-ip"}
```

## Testing Gin Applications

Gin integrates with Go's `net/http/httptest` package for unit testing. Create a test router, perform requests using `httptest.NewRecorder()`, and assert on responses.

```go
package main

import (
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "strings"
    "testing"

    "github.com/gin-gonic/gin"
    "github.com/stretchr/testify/assert"
)

// Setup router for testing
func setupRouter() *gin.Engine {
    gin.SetMode(gin.TestMode)
    r := gin.Default()

    r.GET("/ping", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"message": "pong"})
    })

    r.POST("/users", func(c *gin.Context) {
        var user struct {
            Name string `json:"name" binding:"required"`
        }
        if err := c.ShouldBindJSON(&user); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }
        c.JSON(http.StatusCreated, gin.H{"name": user.Name})
    })

    return r
}

func TestPingRoute(t *testing.T) {
    router := setupRouter()

    w := httptest.NewRecorder()
    req, _ := http.NewRequest(http.MethodGet, "/ping", nil)
    router.ServeHTTP(w, req)

    assert.Equal(t, http.StatusOK, w.Code)
    assert.Contains(t, w.Body.String(), "pong")
}

func TestCreateUser(t *testing.T) {
    router := setupRouter()

    // Test valid request
    w := httptest.NewRecorder()
    body := strings.NewReader(`{"name":"John"}`)
    req, _ := http.NewRequest(http.MethodPost, "/users", body)
    req.Header.Set("Content-Type", "application/json")
    router.ServeHTTP(w, req)

    assert.Equal(t, http.StatusCreated, w.Code)

    var response map[string]string
    json.Unmarshal(w.Body.Bytes(), &response)
    assert.Equal(t, "John", response["name"])
}

func TestCreateUserValidation(t *testing.T) {
    router := setupRouter()

    // Test invalid request (missing required field)
    w := httptest.NewRecorder()
    body := strings.NewReader(`{}`)
    req, _ := http.NewRequest(http.MethodPost, "/users", body)
    req.Header.Set("Content-Type", "application/json")
    router.ServeHTTP(w, req)

    assert.Equal(t, http.StatusBadRequest, w.Code)
}

// Run tests: go test -v
```

Gin is ideal for building REST APIs, microservices, and web applications that require high performance and developer productivity. Its middleware architecture supports authentication, logging, rate limiting, CORS, and custom processing logic, making it suitable for both simple APIs and complex enterprise applications.

The framework integrates seamlessly with Go's standard library and ecosystem, supporting database connections, message queues, caching layers, and external services. Common integration patterns include using Gin with GORM for database operations, JWT for authentication, Redis for caching, and Docker/Kubernetes for deployment. The extensive middleware ecosystem through gin-contrib provides ready-to-use solutions for sessions, CORS, compression, metrics, and more.