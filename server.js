// Gọi tới các core node module
var http = require( "http" );

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

// Tại đây, các Worker sẽ chạy trên V8 process độc lập - và không chia sẻ bộ nhớ với
// Cluster hay các Worker khác. Một ngoại lệ đáng chú ý là nó được phép chia sẻ port với
// Cluster. Do đó,mỗi Worker sẽ chia sẻ  port 8000 với Cluster. Hay nếu module phải chạy 
// dưới dạng entry-point của ứng dụng thì nó sẽ dùng luôn port 8000 như mọi lần nó 
// chạy mà không cần Cluster
http
    .createServer(
        function handleRequest( request, response ) {

            response.writeHead(
                200,
                {
                    "Content-Type": "text/html"
                }
            );
            response.write( "Hello world from process " + process.pid + "." );

            // Để Cluster phân bổ các requests thông qua thuật toán điều phối Round Robin
            // thông thường -TRONG DEMO- tôi sẽ giữ các requests luôn mở để có thể  
            // sinh ra các concurrent requests tới Cluster
            setTimeout( response.end.bind( response ), 300 );

        }
    )
    .listen( 8000 );