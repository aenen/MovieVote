using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movie_Vote_Data.BusinessLayer
{
    public class UserVote
    {
        public UserVote(string SessionId)
        {
            this.SessionId = SessionId;
            MovieId = new List<int>();
        }

        public string SessionId { get; set; }
        public List<int> MovieId { get; set; }
    }
}
