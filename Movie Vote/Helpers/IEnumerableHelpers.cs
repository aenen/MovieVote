using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;

namespace Movie_Vote.Helpers
{
    public static class IEnumerableHelpers
    {
        public static IEnumerable<T> OrderByProperty<T>(this IEnumerable<T> entities, string propertyName, bool isAscending=true)
        {
            if (!entities.Any() || string.IsNullOrEmpty(propertyName))
                return entities;

            var propertyInfo = entities.First().GetType().GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
            Func<T,object> func = x => propertyInfo.GetValue(x, null);
            var result = (isAscending) ? entities.OrderBy(func) : entities.OrderByDescending(func);
            return result;
        }
    }
}