using Microsoft.EntityFrameworkCore;
using csts.Models;

namespace csts.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Comment> Comments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User constraints
            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(u => u.Name)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(u => u.Email)
                      .IsRequired();

                entity.Property(u => u.PasswordHash)
                      .IsRequired();

                entity.Property(u => u.Role)
                      .IsRequired();

                entity.Property(u => u.IsActive)
                      .HasDefaultValue(true);

                entity.HasIndex(u => u.Email).IsUnique();
                entity.Property(u => u.CreatedDate)
                      .HasDefaultValueSql("GETUTCDATE()");
            });

            // Ticket constraints
            modelBuilder.Entity<Ticket>(entity =>
            {
                entity.Property(t => t.Title)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(t => t.Description)
                      .IsRequired();

                entity.Property(t => t.Priority)
                      .IsRequired();

                entity.Property(t => t.Status)
                      .IsRequired();

                entity.Property(t => t.CreatedDate)
                      .HasDefaultValueSql("GETUTCDATE()");
            });

            // Comment constraints
            modelBuilder.Entity<Comment>(entity =>
            {
                entity.Property(c => c.Message).IsRequired();
                entity.Property(c => c.CreatedDate)
                      .HasDefaultValueSql("GETUTCDATE()");
            });

            // User-Ticket relationships
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.CreatedByUser)
                .WithMany(u => u.CreatedTickets)
                .HasForeignKey(t => t.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.AssignedToUser)
                .WithMany(u => u.AssignedTickets)
                .HasForeignKey(t => t.AssignedTo)
                .OnDelete(DeleteBehavior.Restrict);

            // Ticket-Comment relationships
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Ticket)
                .WithMany(t => t.Comments)
                .HasForeignKey(c => c.TicketId)
                .OnDelete(DeleteBehavior.Cascade);

            // User-Comment relationships
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Global query filters for soft delete
            modelBuilder.Entity<User>().HasQueryFilter(u => !u.IsDeleted);
            modelBuilder.Entity<Ticket>().HasQueryFilter(t => !t.IsDeleted);
            modelBuilder.Entity<Comment>().HasQueryFilter(c => !c.IsDeleted);
        }

        //auto update feature for CreatedDate and UpdatedDate
        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is User || e.Entity is Ticket || e.Entity is Comment);

            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    if (entry.Property("CreatedDate").CurrentValue == null)
                        entry.Property("CreatedDate").CurrentValue = DateTime.UtcNow;
                    entry.Property("UpdatedDate").CurrentValue = DateTime.UtcNow;
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Property("UpdatedDate").CurrentValue = DateTime.UtcNow;
                }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}
