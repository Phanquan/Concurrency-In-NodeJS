
// Gọi tới các core node module
var chalk = require( "chalk" );
var cluster = require( "cluster" );
var os = require( "os" );

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //


// cluster module trong nodejs hoạt động bằng cách xử lý entry-point của ứng dụng
// nhân lên và chia sẻ các Master Port với các Worker port. Như vậy, đoạn code này 
// cần phải phân biệt giữa Master process và (các) Worker process đã được phân chia (fork).
if ( cluster.isMaster ) {

    console.log( chalk.red( "[Cluster]" ), "Master process đang bắt đầu chạy.", process.pid );

    // Vì mỗi NodeJS process xử lý trên một luồng (thread) riêng, nên ta sẽ tạo
    // Các Worker process dựa trên số lượng của Nhân (Cores) có sẵn trên hệ thống.
    // Bằng cách này, các Workers không cần phải choảng nhau để sử dụng tài nguyên 
    // của hệ thống
    for ( var i = 0, coreCount = os.cpus().length ; i < coreCount ; i++ ) {

        var worker = cluster.fork();

    }

    
    // Khi 'vòng đời' của Workers kết thúc,cluster sẽ tạo ra một 'exit' event
    // cho phép ta dùng chúng để thêm mới các Worker process
    cluster.on(
        "exit",
        function handleExit( worker, code, signal ) {

            console.log( chalk.yellow( "[Cluster]" ), "Worker kết thúc.", worker.process.pid );
            console.log( chalk.yellow( "[Cluster]" ), "Tử ẹo:", worker.exitedAfterDisconnect );

            // Nếu một Worker bị buộc kết thúc một cách vô ý như không bắt (catch) được ngoại lệ (exception).
            // Thì khi đó ta sẽ thử (try) tại tạo lại (restart) nó.

            if ( ! worker.exitedAfterDisconnect ) {

                var worker = cluster.fork();

                // CHÝ Ý: Nếu Worker kết thúc ngay lập tức, có lẽ do code bị bug,
                // bạn có thể dính lỗi [theo tôi BIẾT] tiêu thụ tài nguyên CPU liên tục
                // (rapid CPU Consumption) do Master liên tiếp thử tạo mới các Worker.

            }

        }
    );

} else {

    // Lúc nào ta xử lý phân phối chức năng cũng cần phải phân chia riêng rẽ phần code 
    // phân phối ra khỏi các đoạn code khác. Làm vậy sẽ giúp ta tránh định nghĩa Worker 
    // trong nó. Thay vào đó, ta sẽ gọi (require) tới từ một module khác. Cuối cùng việc 
    // này sẽ cho phép ta chạy ứng dụng theo Cluster mode hay một cách Độc lập bằng cách
    // sử dụng các entry-point khác nhau (cluster.js vs server.js)
    require( "./server" );

    console.log( chalk.red( "[Worker]" ), "Worker bắt đầu.", process.pid );

}
