package grpc

import (
	"context"
	"fmt"
	"log"
	"net"

	pb "github.com/ng-namanh/rsias/backend/internal/grpc/proto"
	"google.golang.org/grpc"
)

type Server struct {
	pb.UnimplementedRiskServiceServer
}

func NewServer() *Server {
	return &Server{}
}

func (s *Server) GetRiskReport(ctx context.Context, req *pb.RiskRequest) (*pb.RiskResponse, error) {
	log.Printf("Received risk report request for ticker: %s", req.Ticker)
	// Placeholder logic
	return &pb.RiskResponse{
		Ticker:         req.Ticker,
		ReportContent:  fmt.Sprintf("Risk report for %s is being generated.", req.Ticker),
		RiskScore:      0.5,
		Citations:      []string{"Source 1", "Source 2"},
	}, nil
}

func RunServer(port string) {
	lis, err := net.Listen("tcp", ":"+port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterRiskServiceServer(s, &Server{})
	log.Printf("gRPC server listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
